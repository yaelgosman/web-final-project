
import { Request, Response } from "express";
import Post from "../models/postModel";

// GET /api/search - search with filters
// Query params: q (search), cuisine, city, minRating, maxRating, sortBy
export const searchPosts = async (req: Request, res: Response) => {
    try {
        const {
            searchText,
            cuisine,
            city,
            minRating,
            maxRating,
            sortBy = "createdAt",
            page = 1,
            limit = 10
        } = req.query;

        const filter: any = {};

        // Free text search
        if (searchText) {
            filter.$or = [
                { "restaurant.name": { $regex: searchText, $options: "i" } },
                { text: { $regex: searchText, $options: "i" } },
                { "restaurant.city": { $regex: searchText, $options: "i" } },
            ];
        }

        // Filter by cuisine
        if (cuisine) {
            filter["restaurant.cuisine"] = cuisine;
        }

        // Filter by city
        if (city) {
            filter["restaurant.city"] = { $regex: city, $options: "i" };
        }

        // Filter by rating range
        if (minRating) {
            filter.rating = { $gte: parseInt(minRating as string) };
        }
        if (maxRating) {
            if (filter.rating) {
                filter.rating.$lte = parseInt(maxRating as string);
            } else {
                filter.rating = { $lte: parseInt(maxRating as string) };
            }
        }

        // Sorting
        const sortObj: any = {};
        if (sortBy === "rating") {
            sortObj.rating = -1;
        } else if (sortBy === "likes") {
            sortObj.likeCount = -1;
        } else if (sortBy === "comments") {
            sortObj.commentCount = -1;
        } else {
            sortObj.createdAt = -1; // Default: newest first
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const posts = await Post.find(filter)
            .populate("userId", "username profileImagePath")
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit as string));

        const total = await Post.countDocuments(filter);

        res.status(200).json({
            data: posts,
            pagination: {
                current: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error: any) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Search failed" });
    }
};

// GET /api/search/recommendations - recommendations from AI
// For example: "I want a good northern restaurant in Tel Aviv"
export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        // TODO: add call to AI to analyze the query
        // const analysis = await analyzeQueryWithAI(query);
        // const { cuisine, city, rating } = analysis;

        // For now - simple search
        const posts = await Post.find({
            $or: [
                { "restaurant.name": { $regex: query, $options: "i" } },
                { text: { $regex: query, $options: "i" } },
                { "restaurant.city": { $regex: query, $options: "i" } },
            ],
        } as any)
            .populate("userId", "username profileImagePath")
            .sort({ rating: -1, likeCount: -1 })
            .limit(20);

        res.status(200).json({
            query,
            results: posts,
            count: posts.length,
        });
    } catch (error: any) {
        console.error("Recommendations error:", error);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
};

// GET /api/search/filters - Get available filters
export const getFilterOptions = async (req: Request, res: Response) => {
    try {
        const cuisines = await Post.distinct("restaurant.cuisine");
        const cities = await Post.distinct("restaurant.city");

        res.status(200).json({
            cuisines: cuisines.filter((c: any) => c !== null),
            cities,
            ratings: [1, 2, 3, 4, 5],
            sortOptions: [
                { value: "createdAt", label: "Newest" },
                { value: "rating", label: "Highest Rated" },
                { value: "likes", label: "Most Liked" },
                { value: "comments", label: "Most Discussed" },
            ],
        });
    } catch (error: any) {
        console.error("Get filters error:", error);
        res.status(500).json({ error: "Failed to get filter options" });
    }
};

// GET /api/search/trending - Get trending restaurants
export const getTrending = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;

        // restaurants with the most likes and comments recently
        const trending = await Post.aggregate([
            {
                $sort: { likeCount: -1, commentCount: -1, createdAt: -1 },
            },
            {
                $limit: parseInt(limit as string),
            },
        ]);

        // Populate user info
        await Post.populate(trending, {
            path: "userId",
            select: "username profileImagePath",
        });

        res.status(200).json(trending);
    } catch (error: any) {
        console.error("Trending error:", error);
        res.status(500).json({ error: "Failed to get trending" });
    }
};