const Message = require("../models/messageModel");

const OPENED_ROOM = ["react", "node"];
exports.getOldMessage = async (req, res, next) => {
  const { roomName } = req.params;

  if (OPENED_ROOM.includes(roomName)) {
    const messages = await Message.find({ room: roomName }).select("message username sent_at");
    return res.status(200).json(messages);
  }
  return res.status(403).json("Room is not opened");
};
