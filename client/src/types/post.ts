export interface PostType {
  _id: string;
  userId: string;
  restaurant: {
    name: string;
    city: string;
  };
  rating: number;
  text: string;
  imagePath?: string; 
  createdAt: string;
  updatedAt: string;
}