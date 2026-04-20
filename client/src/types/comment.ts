// This is a test (that i havent tested yet...) the difference between the two is that here we also have more info on the user
// export interface CommentType {
//     _id?: string;
//     postId: string;
//     userId: string;
//     text: string;
//     createdAt: Date;
// }

// Temporary interface until we create the real one
export interface CommentType {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    profileImageUrl?: string;
  };
  text: string;
  createdAt: string;
}