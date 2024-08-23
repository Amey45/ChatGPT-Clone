const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");
const auth = require("../middlewares/auth");

router.get("/getAllChats", auth, chatController.getAllChats);
router.post("/createChat", auth, chatController.createChat);
router.patch("/updateChat/:id", auth, chatController.updateChat);
router.delete("/deleteChat/:id", auth, chatController.deleteChat);

router.get("/:chatId/message", auth, chatController.getChatMessages);
router.post("/:chatId/createMessage", auth, chatController.createChatMessage);

module.exports = router;
