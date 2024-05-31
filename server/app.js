const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const cors = require("cors");
const formatMessage = require("./utils/formatMessage")
// dot env config
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server is running at http://localhost:" + PORT);
});

const io = socketIO(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  // socket.on();
  console.log("Socket is connected ✅");
  const BOT = "CHAT BOT"
  socket.emit("message", formatMessage(BOT, "Welcome from the room 🤖"));

  // message for join user
  socket.broadcast.emit("message", formatMessage(BOT, "Anonymous user joined the room ."));

  socket.on("disconnect", (_) => {
    io.emit("message", formatMessage(BOT, "Anonymous user left the room ."))
  })
});

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then((_) => {
//     console.log("database successfully connected ✅");

//   })
//   .catch((error) => console.log(error));
