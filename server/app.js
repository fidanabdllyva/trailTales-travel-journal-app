const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { CLIENT_URL } = require("./src/config/config");
const errorHandler = require("./src/middlewares/errorHandler");
const userRouter = require("./src/routes/userRoute");
const travelListRouter = require("./src/routes/travelListRoute");
const passport = require("passport");
require("./src/config/passport");
const googleAuthRoute = require("./src/routes/googleAuthRoute");
const destinationRouter=require("./src/routes/destinationRoute")
const journalEntryRouter = require("./src/routes/journalEntryRoute")


const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(limiter);
app.use(helmet());

// Your routes here
app.use("/auth", userRouter);
app.use("/list", travelListRouter);
app.use("/destination", destinationRouter)
app.use("/journal", journalEntryRouter)

app.use(passport.initialize());
app.use("/auth", googleAuthRoute); 

// Error handler
app.use(errorHandler);

module.exports = app;
