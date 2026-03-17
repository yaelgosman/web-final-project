import express from "express";
import * as searchController from "../controllers/searchController";

const searchRouter = express.Router();

// GET /api/search - Search posts with filters
searchRouter.get("/", searchController.searchPosts);

// AI recommendations
searchRouter.get("/recommendations", searchController.getRecommendations);

// GET /api/search/filters - Get available filters
searchRouter.get("/filters", searchController.getFilterOptions);

// GET /api/search/trending - Get trending posts
searchRouter.get("/trending", searchController.getTrending);

export default searchRouter;