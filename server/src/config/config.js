require("dotenv").config();


module.exports = {
    PORT: process.env.PORT || 3030,
    DB_URL: process.env.DB_URL,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GMAIL_APP_NAME: process.env.GMAIL_APP_NAME,
    GMAIL_USER: process.env.GMAIL_USER,
    SERVER_URL: process.env.SERVER_URL,
}