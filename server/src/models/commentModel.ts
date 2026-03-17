import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  profileImagePath: string;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
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
    username: {
      type: String,
      required: true,
    },
    profileImagePath: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: true,
      maxlength: 300,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

export default model<IComment>("Comment", commentSchema);
