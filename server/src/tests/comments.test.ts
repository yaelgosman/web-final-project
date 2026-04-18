import request from "supertest";
import initApp from "../index";
import Comments from "../models/commentModel";
import Post from "../models/postModel";
import { Express } from "express";
import User from "../models/userModel";
import { registerTestUser, userData, commentsData, singlePostData } from "./testUtils";
import mongoose from "mongoose";

let app: Express;
let postId: string;

beforeAll(async () => {
  app = await initApp();
  await Comments.deleteMany({});
  await Post.deleteMany({});
  await registerTestUser(app);
  
  // Create a post to comment on
  const postRes = await request(app).post("/api/posts")
    .set("Authorization", "Bearer " + userData.token)
    .send(singlePostData);
  postId = postRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments API", () => {
  test("test post comment", async () => {
    const data = commentsData(postId);
    for (const comment of data) {
      const response = await request(app).post("/api/comments")
        .set("Authorization", "Bearer " + userData.token)
        .send(comment);
      expect(response.statusCode).toBe(200);
      expect(response.body.text).toBe(comment.text);
      comment._id = response.body._id;
    }
  });

  test("test get comments by post", async () => {
    const response = await request(app).get("/api/comments/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(commentsData(postId).length);
  });

  test("test update comment by id", async () => {
    const data = commentsData(postId);
    const commentId = data[0]._id; // Need to ensure it was set in previous test
    // Actually our testUtils returns new objects every call, so I should manage IDs carefully.
    
    const allComments = await request(app).get("/api/comments/" + postId);
    const cid = allComments.body[0]._id;

    const response = await request(app)
      .put("/api/comments/" + cid)
      .set("Authorization", "Bearer " + userData.token)
      .send({ text: "Updated comment text" });
      
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe("Updated comment text");
  });

  test("test delete comment by id", async () => {
    const allComments = await request(app).get("/api/comments/" + postId);
    const cid = allComments.body[0]._id;

    const response = await request(app).delete("/api/comments/" + cid)
      .set("Authorization", "Bearer " + userData.token);
    expect(response.statusCode).toBe(200);

    const nextComments = await request(app).get("/api/comments/" + postId);
    expect(nextComments.body.length).toBe(allComments.body.length - 1);
  });
});
