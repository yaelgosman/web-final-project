// server/controllers/aiController.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import Post from "../models/postModel";
import { Request, Response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const smartSearch = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        const prompt = `
      Extract search filters from this user request: "${query}".
      Return ONLY a JSON object with keys: "city", "category", "keywords", "minRating", "maxRating", "excludeCities", "excludeKeywords".
      
      CRITICAL: "category" must be exactly ONE of these values: ["italian", "asian", "middle_eastern", "street_food", "bakery", "healthy", null]. If the user asks for asian food, set it to "asian". If pizza -> "italian". If bakery -> "bakery". If nothing matches, use null.
      
      CRITICAL INSTRUCTIONS FOR RATINGS:
      - "good", "great", "excellent" means minRating: 4
      - "bad", "not good", "terrible", "awful" means maxRating: 3
      If they don't explicitly mention quality or rating, use null.

      Example 1: "I want spicy pasta in Tel Aviv with at least 4 stars" -> {"city": "Tel Aviv", "category": "italian", "keywords": ["spicy pasta", "noodles"], "minRating": 4, "maxRating": null, "excludeCities": [], "excludeKeywords": []}
      Example 2: "not good asian restaurant" -> {"city": null, "category": "asian", "keywords": [], "minRating": null, "maxRating": 3, "excludeCities": [], "excludeKeywords": []}
      Example 3: "good restaurants in te aviv" -> {"city": "Tel Aviv", "category": null, "keywords": [], "minRating": 4, "maxRating": null, "excludeCities": [], "excludeKeywords": []}
      Example 4: "burgers but no cheese" -> {"city": null, "category": "street_food", "keywords": ["burgers", "hamburger"], "minRating": null, "maxRating": null, "excludeCities": [], "excludeKeywords": ["cheese"]}
      
      CRITICAL INSTRUCTIONS FOR "keywords":
      - ONLY include specific food types (e.g., sushi, burger, pizza) or specific restaurant names.
      - DO NOT include generic adjectives or nouns like "good", "best", "bad", "restaurant", "food", "place", "eat", "asian", "italian". 
      - DO NOT put cities in keywords.
      
      If a location is mentioned, normalize its name (e.g. "tlv" or "te aviv" -> "Tel Aviv", "pt" -> "Petach Tikva") and put it ONLY in the "city" field.
      The "excludeCities" and "excludeKeywords" fields should capture any locations or terms the user explicitly DOES NOT want.
      If a field is missing, use null (or empty array).
    `;

        let result;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            result = await model.generateContent(prompt);
        } catch (e) {
            console.warn("gemini-1.5-flash failed, trying fallback models...");
            const modelNames = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-pro-latest"];
            let fallbackAttempted = false;
            for (const modelName of modelNames) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    result = await model.generateContent(prompt);
                    fallbackAttempted = true;
                    console.warn(`Successfully used fallback model: ${modelName}`);
                    break; // Exit loop if successful
                } catch (fallbackError) {
                    console.warn(`${modelName} failed:`, fallbackError);
                }
            }
            if (!fallbackAttempted || !result) {
                throw new Error("All AI models failed to generate content.");
            }
        }

        const responseText = result.response.text();

        // Robust JSON extraction
        let filters;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            filters = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            throw new Error("Invalid AI response format");
        }

        console.log("AI Generated Filters:", filters);

        if (!filters) {
            return res.json([]);
        }

        // building the query for mongo
        const mongoQuery: any = {};

        if (filters.category && typeof filters.category === 'string' && filters.category.toLowerCase() !== 'null') {
            mongoQuery.category = filters.category;
        }

        if (filters.city && typeof filters.city === 'string' && filters.city.trim() !== '' && filters.city.toLowerCase() !== 'null') {
            mongoQuery["restaurant.city"] = { $regex: new RegExp(escapeRegExp(filters.city), 'i') };
        }

        if (filters.excludeCities && Array.isArray(filters.excludeCities) && filters.excludeCities.length > 0) {
            const excludeCityRegexes = filters.excludeCities.map((c: string) => new RegExp(escapeRegExp(c), 'i'));
            mongoQuery["restaurant.city"] = {
                ...(mongoQuery["restaurant.city"] || {}),
                $nin: excludeCityRegexes
            };
        }

        if (filters.keywords && Array.isArray(filters.keywords) && filters.keywords.length > 0) {
            const regexes = filters.keywords.map((kw: string) => new RegExp(escapeRegExp(kw), 'i'));
            mongoQuery.$or = [
                { "restaurant.name": { $in: regexes } },
                { "text": { $in: regexes } }
            ];
        }

        if (filters.excludeKeywords && Array.isArray(filters.excludeKeywords) && filters.excludeKeywords.length > 0) {
            const excludeRegexes = filters.excludeKeywords.map((kw: string) => new RegExp(escapeRegExp(kw), 'i'));
            if (!mongoQuery.$and) mongoQuery.$and = [];
            mongoQuery.$and.push({ "restaurant.name": { $nin: excludeRegexes } });
            mongoQuery.$and.push({ "text": { $nin: excludeRegexes } });
        }

        if (filters.minRating && filters.minRating !== 'null') {
            const ratingNumber = Number(filters.minRating);
            if (!isNaN(ratingNumber)) {
                if (!mongoQuery["rating"]) mongoQuery["rating"] = {};
                mongoQuery["rating"]["$gte"] = ratingNumber;
            }
        }

        if (filters.maxRating && filters.maxRating !== 'null') {
            const maxRatingNumber = Number(filters.maxRating);
            if (!isNaN(maxRatingNumber)) {
                if (!mongoQuery["rating"]) mongoQuery["rating"] = {};
                mongoQuery["rating"]["$lte"] = maxRatingNumber;
            }
        }

        console.log("Mongo Query:", JSON.stringify(mongoQuery, null, 2));
        const posts = await Post.find(mongoQuery).populate('userId', 'username profileImageUrl');
        res.json(posts);
    } catch (error: any) {
        console.error("AI Search Error details:", error.message || error);

        let statusCode = 500;
        let errorMessage = "AI Search failed";

        if (error.message && (error.message.includes("429") || error.message.includes("Too Many Requests"))) {
            statusCode = 429;
            errorMessage = "Google AI API Rate Limit Reached (429). Please wait or use a new API key.";
        }

        res.status(statusCode).json({ error: errorMessage });
    }
};