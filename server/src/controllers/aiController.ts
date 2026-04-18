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
      Return ONLY a JSON object with keys: "city", "keywords", "minRating".
      Example 1: "I want spicy pasta in Tel Aviv with at least 4 stars" -> {"city": "Tel Aviv", "keywords": ["spicy pasta", "italian", "noodles"], "minRating": 4}
      Example 2: "Where can I find some good meat?" -> {"city": null, "keywords": ["meat", "burger", "steak", "bbq", "beef"], "minRating": null}
      The "keywords" field should be an array of strings representing the main food/restaurant requested, PLUS close synonyms or specific dishes related to it.
      If a field is missing, use null (or empty array for keywords).
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

        if (filters.city && typeof filters.city === 'string' && filters.city.toLowerCase() !== 'null') {
            mongoQuery["restaurant.city"] = new RegExp(escapeRegExp(filters.city), 'i');
        }

        if (filters.keywords && Array.isArray(filters.keywords) && filters.keywords.length > 0) {
            const regexes = filters.keywords.map((kw: string) => new RegExp(escapeRegExp(kw), 'i'));
            mongoQuery.$or = [
                { "restaurant.name": { $in: regexes } },
                { "text": { $in: regexes } }
            ];
        }

        if (filters.minRating && filters.minRating !== 'null') {
            const ratingNumber = Number(filters.minRating);
            if (!isNaN(ratingNumber)) {
                mongoQuery["rating"] = { $gte: ratingNumber };
            }
        }

        console.log("Mongo Query:", JSON.stringify(mongoQuery, null, 2));
        const posts = await Post.find(mongoQuery).populate('userId', 'username profileImageUrl');
        res.json(posts);
    } catch (error: any) {
        console.error("AI Search Error details:", error);
        res.status(500).json({ error: "AI Search failed" });
    }
};