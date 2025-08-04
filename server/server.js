const app = require("./app")
const connectToDB=require("./src/config/db")

connectToDB(app)