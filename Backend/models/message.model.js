const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  messageBody: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    Default: Date.now,
  },
});

module.exports = mongoose.model("Message", Schema);
