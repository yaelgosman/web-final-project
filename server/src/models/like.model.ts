import { Schema, model, Document, Types } from "mongoose";

export interface ILike extends Document {
  reviewId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// prevent duplicate likes
likeSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default model<ILike>("Like", likeSchema);
