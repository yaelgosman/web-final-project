import { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  restaurant: {
    name: string;
    city: string;
  };
  rating: number;
  text: string;
  imagePath?: string;
  commentsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: String, ref: "User", required: true },
    restaurant: {
      name: { type: String, required: true },
      city: { type: String, required: true },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    imagePath: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This tells Mongoose: "Go to the Comment model, find every comment where the 'postId' matches this post's '_id', and give me the total count."
postSchema.virtual("commentsCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  count: true            
});

export default model<IPost>("Post", postSchema);