import mongoose from "mongoose";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

//send message to ai model
async function sendMessage(req, res, next) {
  try {
    const { message, chatId } = req.body; // will receive message/chatId from body
    if (!message?.trim()) {
      const error = new Error("Message is required");
      error.statusCode = 400;
      throw error;
    }

    let chat = null;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user.id });
      if (!chat) {
        const error = new Error("Chat not found");
        error.statusCode = 404;
        throw error;
      }
    } else {
      //If no chat found menas this is the first message of the user.
      const title = await generateChatTitle(message); //generate the title and chat on first message;
      chat = await Chat.create({
        user: req.user.id,
        title,
      });
    }

    //chat is used to save the user message with chatId
    // save user message first, then load full history for this chat
    await Message.create({
      chat: chat._id,
      role: "user",
      content: message,
    });

    const messages = await Message.find({ chat: chat._id }).sort({
      createdAt: 1,
    });

    //Model is invoked on the given message
    const result = await generateResponse(messages);

    // Model return response in text which is saved as message role : assistant
    const aiMessage = await Message.create({
      chat: chat._id,
      role: "assistant",
      content: result,
    });

    return res.status(201).json({
      chatId: chat._id,
      title: chat.title,
      aimessage: aiMessage.content,
    });
  } catch (error) {
    next(error);
  }
}

//fetch chats
async function getChats(req, res, next) {
  try {
    const user = req.user;

    const chats = await Chat.find({ chat: user._id });

    return res
      .status(200)
      .json({ message: "Chats fetched succesfully", chats });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      const error = new Error("Invalid chat id");
      error.statusCode = 400;
      throw error;
    }

    const chat = await Chat.findOne({ _id: chatId, user: req.user.id });

    if (!chat) {
      const error = new Error("Chat not found");
      error.statusCode = 404;
      throw error;
    }

    const messages = await Message.find({ chat: chat._id }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    next(error);
  }
}

// Delete Chat
async function deleteChat(req, res, next) {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      const error = new Error("Invalid chat id");
      error.statusCode = 400;
      throw error;
    }
    //delete chat
    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      user: req.user.id,
    });

    //delete messages of chat
    await Message.deleteMany({
      chat: chatId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ message: "chat deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export default { sendMessage, getChats, getMessages, deleteChat };
