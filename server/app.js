const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const cors = require("cors");
const userOperation = require("./utils/user");

const formatMessage = require("./utils/formatMessage");
// dot env config
const dotenv = require("dotenv");
dotenv.config();

const Message = require("./models/messageModel");
const MessageController = require("./controllers/messageController");

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

app.get("/chat/:roomName", MessageController.getOldMessage);

io.on("connection", (socket) => {
  // socket.on();
  console.log("Socket is connected ✅");
  const BOT = "CHAT BOT";

  socket.on("joined_room", (data) => {
    const { username, room } = data;
    if (room) {
      const user = userOperation.storeUser(socket.id, username, room);

      socket.join(user.room);
      console.log(user, "Dwdawdwd");

      // message for join user

      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(BOT, `${user.username} joined the room .`)
        );

      socket.on("message_send", (data) => {
        io.to(user.room).emit("message", formatMessage(user.username, data));

        Message.create({
          username: user.username,
          message: data,
          room: user.room,
        });
      });

      console.log("hi");

      io.to(user.room).emit(
        "room_users",
        userOperation.getSameRoomUsers(user.room)
      );
    }
  });

  socket.emit("message", formatMessage(BOT, "Welcome from the room 🤖"));

  socket.on("disconnect", (_) => {
    const user = userOperation.getUser(socket.id);

    if (user) {
      userOperation.removeUser(user._id);
      io.to(user.room).emit(
        "message",
        formatMessage(BOT, `${user.username} left the room .`)
      );

      io.to(user.room).emit(
        "room_users",
        userOperation.getSameRoomUsers(user.room)
      );
    }
  });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then((_) => {
    console.log("database successfully connected ✅");
  })
  .catch((error) => console.log(error));
