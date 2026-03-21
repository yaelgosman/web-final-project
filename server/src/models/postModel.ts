import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId;
  restaurant: {
    name: string;
    city: string;
    cuisine?: string;
  };
  rating: number;
  text: string;
  imagePath?: string;
  commentCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    restaurant: {
      name: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      cuisine: {
        type: String,
        default: null,
        trim: true,
      },
    },
    rating: { type: Number, required: true, min: 1, max: 5, integer: true },
    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    imagePath: { type: String },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ "restaurant.city": 1 });
postSchema.index({ rating: 1 });
postSchema.index({ createdAt: -1 });

export default model<IPost>("Post", postSchema);
