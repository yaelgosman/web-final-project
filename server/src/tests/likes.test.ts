import request from "supertest";
import initApp from "../index";
import Like from "../models/likeModel";
import Post from "../models/postModel";
import { Express } from "express";
import User from "../models/userModel";
import { registerTestUser, userData, singlePostData } from "./testUtils";
import mongoose from "mongoose";

let app: Express;
let postId: string;

beforeAll(async () => {
  app = await initApp();
  await Like.deleteMany({});
  await Post.deleteMany({});
  await registerTestUser(app);

  const postRes = await request(app).post("/api/posts")
    .set("Authorization", "Bearer " + userData.token)
    .send(singlePostData);
  postId = postRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Likes API", () => {
  test("test like a post", async () => {
    const response = await request(app).post("/api/likes")
      .set("Authorization", "Bearer " + userData.token)
      .send({ postId });
    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe(postId);
  });

  test("test get likes for a post", async () => {
    const response = await request(app).get("/api/likes/" + postId)
      .set("Authorization", "Bearer " + userData.token);
    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.hasLiked).toBe(true);
  });

  test("test unlike a post", async () => {
    const response = await request(app).delete("/api/likes")
      .set("Authorization", "Bearer " + userData.token)
      .send({ postId });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Unliked");

    const checkRes = await request(app).get("/api/likes/" + postId)
      .set("Authorization", "Bearer " + userData.token);
    expect(checkRes.body.count).toBe(0);
    expect(checkRes.body.hasLiked).toBe(false);
  });
});
