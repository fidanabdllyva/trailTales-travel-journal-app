export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string; 
  profileImage: {
    url: string;
    public_id?: string;
  };
  premium: boolean;
  lists?: string[]; 
  isVerified: boolean;
  authProvider: 'google' | 'apple' | 'local';
  authId?: string | null;
  fullName: string;
  loginAttempts: number;
  lockUntil?: string | null; 
  createdAt?: string;
  updatedAt?: string;
}
