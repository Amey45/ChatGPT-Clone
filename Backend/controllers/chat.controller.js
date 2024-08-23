const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
// const OpenAI = require("https://deno.land/x/openai@v4.53.0/mod.ts");
// const openai = new OpenAI();

exports.getAllChats = async (req, res, next) => {
  await Chat.find({ userId: req.userId })
    .exec()
    .then((chats) => {
      res.status(200).send(chats);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ err: err, message: "Error fetching chats or User not valid" });
    });
};

exports.createChat = async (req, res, next) => {
  console.log("body" + req.body);
  let title = req.body.title;
  let userId = req.userId;

  console.log(title + " " + userId);

  const result = await Chat.find({ userId: userId, title: title });

  if (!title || result.length != 0) {
    return res
      .status(400)
      .json({ message: "Chat Name Already Exists Or It is Invalid" });
  }

  let createdAt = new Date();

  let newChat = new Chat({
    title: title,
    userId: userId,
    createdAt: createdAt,
  });

  newChat.save().then((result) => {
    res.status(200).send(result);
  });
};

exports.updateChat = async (req, res, next) => {
  const updatedChatFields = req.body;

  updatedChatFields.createdAt = new Date();
  console.log(req.params.id);

  Chat.findByIdAndUpdate(req.params.id, updatedChatFields, { new: true })
    .then((updatedChat) => {
      if (!updatedChat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      res.json(updatedChat);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.deleteChat = async (req, res, next) => {
  Chat.findByIdAndDelete(req.params.id)
    .then((deletedChat) => {
      if (!deletedChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.json({
        message: "Chat Deleted Successfully",
        deletedChat: deletedChat,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.getChatMessages = async (req, res, next) => {
  let chatId = req.params.chatId;

  await Message.find({ userId: req.userId, chatId: chatId })
    .exec()
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal server error" });
    });
};

exports.createChatMessage = async (req, res, next) => {
  let chatId = req.params.chatId;
  let messageBody = req.body.messageBody;

  if (!messageBody) {
    return res.status(400).json({ message: "Empty or Invalid Message body" });
  }

  let createdAt = new Date();

  const message = new Message({
    messageBody: messageBody,
    messageType: "User",
    chatId: chatId,
    userId: req.userId,
    createdAt: createdAt,
  });

  // console.log(process.env.OPENAI_API_KEY);

  const completions = await openai.chat.completions.create({
    messages: [{ role: "user", content: messageBody }],
    model: "gpt-4o",
    max_tokens: 200,
  });

  let replyMessage = completions.choices[0].message.content;

  let reply = new Message({
    messageBody: replyMessage,
    messageType: "AI",
    chatId: chatId,
    userId: req.userId,
    createdAt: createdAt,
  });

  try {
    await message.save();
  } catch (error) {
    res
      .status(500)
      .json({ error: error, message: "Error creating chat message" });
  }

  try {
    const result = await reply.save();
    res.status(200).json({
      message: message,
      message2: "Reply Generated successfully",
      replyMessage: reply,
    });
  } catch (error) {
    res.status(500).json({ error: error, message: "Error generating reply" });
  }
};
