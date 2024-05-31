const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  sent_at: {
    type: Date,
    default: Date.now(),
  },
  room: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
