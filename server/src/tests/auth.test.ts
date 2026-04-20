import request from "supertest";
import initApp from "../index";
import { Express } from "express";
import User from "../models/userModel";
import Post from "../models/postModel";
import { userData, singlePostData } from "./testUtils";
import mongoose from "mongoose";

let app: Express;
beforeAll(async () => {
    app = await initApp();
    await User.deleteMany({});
    await Post.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth API", () => {
    test("access restricted url denied", async () => {
        const response = await request(app).post("/api/posts").send(singlePostData);
        expect(response.statusCode).toBe(401);
    });

    test("test register", async () => {
        const response = await request(app).post("/api/auth/register").send({
            email: userData.email,
            username: userData.username,
            password: userData.password
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        userData._id = response.body._id;
        userData.token = response.body.accessToken;
        userData.refreshToken = response.body.refreshToken;
    });

    test("test access with token permitted1", async () => {
        const response = await request(app).post("/api/posts")
            .set("Authorization", "Bearer " + userData.token)
            .send(singlePostData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
    });

    test("test access with modified token restricted", async () => {
        const newToken = userData.token + "m";
        const response = await request(app).post("/api/posts")
            .set("Authorization", "Bearer " + newToken)
            .send(singlePostData);
        expect(response.statusCode).toBe(401);
        // My middleware returns { error: "..." } or similar
        expect(response.body).toHaveProperty("error");
    });

    test("test login", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: userData.email,
            password: userData.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        userData.token = response.body.accessToken;
        userData.refreshToken = response.body.refreshToken;
    });

    test("test access with token permitted2", async () => {
        const response = await request(app).post("/api/posts")
            .set("Authorization", "Bearer " + userData.token)
            .send(singlePostData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        singlePostData._id = response.body._id;
    });

    //set jest timeout to 15s for the expiration test
    jest.setTimeout(20000);

    // Note: To test real expiration, we'd need to wait or mock time. 
    // Since we can't easily change the server's JWT config here without rebooting, 
    // this test might be skip-able or requires manual wait if token is set very short in .env.test
    // For now I'll implement it as requested.
    test("test token refresh", async () => {
        //get new token using refresh token
        const refreshResponse = await request(app).post("/api/auth/refresh").send({
            refreshToken: userData.refreshToken
        });
        if (refreshResponse.statusCode !== 200) {
            console.log("Refresh failed body:", refreshResponse.body);
        }
        expect(refreshResponse.statusCode).toBe(200);
        expect(refreshResponse.body).toHaveProperty("accessToken");
        expect(refreshResponse.body).toHaveProperty("refreshToken");
        userData.token = refreshResponse.body.accessToken;
        userData.refreshToken = refreshResponse.body.refreshToken;

        //access with new token
        const newAccessResponse = await request(app).post("/api/posts")
            .set("Authorization", "Bearer " + userData.token)
            .send(singlePostData);
        expect(newAccessResponse.statusCode).toBe(201);
        expect(newAccessResponse.body).toHaveProperty("_id");
    });

    test("test logout", async () => {
        const response = await request(app).post("/api/auth/logout").send({
            token: userData.refreshToken
        });
        expect(response.statusCode).toBe(200);
        
        // Try refresh again - should fail
        const refreshResponse = await request(app).post("/api/auth/refresh").send({
            refreshToken: userData.refreshToken
        });
        expect(refreshResponse.statusCode).toBe(401);
    });
});
