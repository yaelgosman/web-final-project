// server/controllers/aiController.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import Post from "../models/postModel";
import { Request, Response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const smartSearch = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Extract search filters from this user request: "${query}".
      Return ONLY a JSON object with keys: "city", "cuisine", "minRating".
      Example: "I want spicy pasta in Tel Aviv with at least 4 stars" -> {"city": "Tel Aviv", "cuisine": "spicy pasta", "minRating": 4}
      If a field is missing, use null.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const filters = JSON.parse(responseText.replace(/```json|```/g, ""));

        // בניית השאילתה למונגו
        const mongoQuery: any = {};
        if (filters.city) mongoQuery["restaurant.city"] = new RegExp(filters.city, 'i');
        if (filters.cuisine) mongoQuery["text"] = new RegExp(filters.cuisine, 'i');
        if (filters.minRating) mongoQuery["rating"] = { $gte: filters.minRating };

        const posts = await Post.find(mongoQuery).populate('userId', 'username profileImageUrl');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "AI Search failed" });
    }
};