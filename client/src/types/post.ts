export interface PostType {
  _id: string;
  userId: string | {
    _id: string;
    username: string;
    profileImageUrl?: string;
  };
  restaurant: {
    name: string;
    city: string;
  };
  rating: number;
  text: string;
  category: string;
  imagePath?: string; 
  createdAt: string;
  updatedAt: string;
  commentsCount?: number;
}