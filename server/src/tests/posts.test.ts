import request from "supertest";
import initApp from "../index";
import Post from "../models/postModel";
import { Express } from "express";
import User from "../models/userModel";
import { registerTestUser, userData, postsData } from "./testUtils";
import mongoose from "mongoose";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await Post.deleteMany({});
  await registerTestUser(app);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts API", () => {
  test("test get all empty db", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.posts).toEqual([]);
  });

  test("test post reviews", async () => {
    for (const post of postsData) {
      const response = await request(app).post("/api/posts")
        .set("Authorization", "Bearer " + userData.token)
        .send(post);
      expect(response.statusCode).toBe(201);
      expect(response.body.text).toBe(post.text);
    }
  });

  test("test get posts after post", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.posts.length).toBe(postsData.length);
    postsData[0]._id = response.body.posts[postsData.length - 1]._id; // posts are sorted -1 by createdAt
  });

  test("test get posts with category filter", async () => {
    const post = postsData[2]; // formal
    const response = await request(app).get(
      "/api/posts?category=" + post.category
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.posts.length).toBe(1);
    expect(response.body.posts[0].category).toBe(post.category);
    postsData[2]._id = response.body.posts[0]._id;
  });

  test("test get posts by userId", async () => {
    const response = await request(app).get("/api/posts/user/" + userData._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(postsData.length);
  });

  test("test put post by id", async () => {
    const postToUpdate = postsData[2];
    postToUpdate.text = "this is the new text";
    const response = await request(app)
      .put("/api/posts/" + postToUpdate._id)
      .set("Authorization", "Bearer " + userData.token)
      .send(postToUpdate);
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(postToUpdate.text);
  });

  test("test delete post by id", async () => {
    const response = await request(app).delete("/api/posts/" + postsData[2]._id)
      .set("Authorization", "Bearer " + userData.token);
    expect(response.statusCode).toBe(200);

    const checkResponse = await request(app).get("/api/posts");
    expect(checkResponse.body.posts.length).toBe(postsData.length - 1);
  });
});
