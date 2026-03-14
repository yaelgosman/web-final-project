import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: String;
  restaurant: {
    name: string;
    city: string;
  };
  rating: number;
  text: string;
  imagePath?: string;
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
  }
);

export default model<IPost>("Post", postSchema);
