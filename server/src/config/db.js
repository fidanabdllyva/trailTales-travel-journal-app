const mongoose = require("mongoose");
const http = require("http");
const { initSocket } = require("./socket"); // your separate socket config
const { PORT, DB_URL, DB_PASSWORD, CLIENT_URL } = require("./config");

const connectToDB = (app) => {
  mongoose
    .connect(DB_URL.replace("<db_password>", DB_PASSWORD))
    .then(() => {
      console.log("MongoDB connected 😏");

      const server = http.createServer(app);

      const io = initSocket(server, CLIENT_URL);

      // Store io inside app so controllers can use it
      app.set("io", io);

      server.listen(PORT, () => {
        console.log(`HTTP + WS server running on ${PORT}`);
      });
    })
    .catch((err) => {
      console.warn("DB connection failed 😔", err.message);
    });
};

module.exports = connectToDB;
