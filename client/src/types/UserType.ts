export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  profileImage: string ;
  public_id: string;
  premium: boolean;
  lists?: string[];
  isVerified: boolean;
  authProvider: 'google' | 'local';
  authId?: string | null;
  fullName: string;
  loginAttempts: number;
  lockUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
  location?: {
    country: string;
    city: string;
  };
  bio?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    x?: string;
  }
}
