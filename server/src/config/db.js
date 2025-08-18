const mongoose = require("mongoose");
const http = require("http");
const { initSocket } = require("./socket"); // your separate socket config
const { PORT, DB_URL, DB_PASSWORD, CLIENT_URL } = require("./config");

const connectToDB = (app) => {
  mongoose
    .connect(DB_URL.replace("<db_password>", DB_PASSWORD))
    .then(() => {
      console.log("MongoDB connected 😏");

      // Create HTTP server for Socket.IO
      const server = http.createServer(app);

      // Initialize Socket.IO
      const io = initSocket(server, CLIENT_URL);

      server.listen(PORT, () => {
        console.log(`HTTP + WS server running on ${PORT}`);
      });

      return { server, io }; // optional if you want to export
    })
    .catch((err) => {
      console.warn("DB connection failed 😔", err.message);
    });
};

module.exports = connectToDB;
