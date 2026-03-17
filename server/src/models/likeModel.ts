import { Schema, model, Document, Types } from "mongoose";

export interface ILike extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });
likeSchema.index({ postId: 1 });

export default model<ILike>("Like", likeSchema);
