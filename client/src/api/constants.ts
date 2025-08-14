export const API_BASE_URL: string = import.meta.env.VITE_SERVER_URL || "http://localhost:5050";
type endpointType = {
  auth: string;
};

export const endpoints: endpointType = {
  auth: "/auth",
  
}
export const DEFAULT_AVATAR_PHOTO = "/default-avatar.png";