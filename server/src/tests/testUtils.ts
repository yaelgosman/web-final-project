import { Express } from "express";
import request from "supertest";
import User from "../models/userModel";

export type UserData = {
    email: string;
    password: string;
    username: string;
    _id?: string;
    token?: string;
    refreshToken?: string;
};

export const userData: UserData = {
    email: "test@testfood.com",
    username: "testuser",
    password: "testpassword123",
};

export type PostData = {
    text: string;
    rating: number;
    category: string;
    restaurant: {
        name: string;
        city: string;
    };
    _id?: string;
};

export var postsData: PostData[] = [
    { text: "Amazing pizza!", rating: 5, category: "informal", restaurant: { name: "Pizza Hut", city: "Tel Aviv" } },
    { text: "Good burger.", rating: 4, category: "informal", restaurant: { name: "McDonalds", city: "Haifa" } },
    { text: "Fancy dinner.", rating: 5, category: "formal", restaurant: { name: "Messa", city: "Tel Aviv" } },
];

export const singlePostData: PostData =
    { text: "Great place!", rating: 5, category: "informal", restaurant: { name: "Cafe Cafe", city: "Netanya" } };

export type CommentsData = {
    text: string;
    postId: string;
    _id?: string;
};

export var commentsData: (postId: string) => CommentsData[] = (postId) => [
    { text: "Great post!", postId },
    { text: "I agree.", postId },
    { text: "Not the best.", postId },
];

export const registerTestUser = async (app: Express) => {
    await User.deleteMany({ "email": userData.email });

    const res = await request(app).post("/api/auth/register").send({
        email: userData.email,
        username: userData.username,
        password: userData.password
    });
    
    userData._id = res.body._id;
    userData.token = res.body.accessToken;
    userData.refreshToken = res.body.refreshToken;
}
