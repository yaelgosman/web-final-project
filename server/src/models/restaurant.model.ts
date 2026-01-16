import { Schema, model, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  city: string;
  cuisineType?: string;
  createdAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    cuisineType: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default model<IRestaurant>("Restaurant", restaurantSchema);
