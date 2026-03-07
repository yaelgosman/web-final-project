export interface UserType {
  _id?: string;
  username: string;
  email: string;
  password?: string; // Only needed for registration form payload
  provider: "local" | "google" | "facebook";
  profileImage?: string | File; // Can be a URL string or a File object during upload
  createdAt?: string;
}