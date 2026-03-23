import { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  restaurant: {
    name: string;
    city: string;
  };
  rating: number;
  text: string;
  category: string;
  imagePath?: string;
  likesCount: number;
  commentsCount: number;
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
    category: {
      type: String,
      required: true,
      default: 'informal'
    },
    imagePath: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


export default model<IPost>("Post", postSchema);