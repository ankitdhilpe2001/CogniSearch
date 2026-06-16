import mongoose from "mongoose";
import { getIO } from "../sockets/server.sockets.js";
import {
  generateChatTitle,
  generateResponseStream,
} from "../services/ai.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { PDFParse } from "pdf-parse";
import { uploadFileToRAG } from "../services/RAG.service.js";
import { answerQuestion } from "../services/RAG.service.js";

//send message to ai model
// REPLACE YOUR sendMessage FUNCTION IN chat.controller.js WITH THIS
async function sendMessage(req, res, next) {
  try {
    const { message, chatId } = req.body;
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
      const title = await generateChatTitle(message);
      chat = await Chat.create({
        user: req.user.id,
        title,
      });
    }

    // Save user message in message collection with chatId
    await Message.create({
      chat: chat._id,
      role: "user",
      content: message,
    });

    // Get chat history
    const messages = await Message.find({ chat: chat._id }).sort({
      createdAt: 1,
    });

    // Get Socket.io instance
    const io = getIO();
    const socketId = req.headers["x-socket-id"];

    // Stream the response
    let fullResponse = "";
    const onChunk = (chunk) => {
      fullResponse += chunk;
      // Emit each chunk to the specific user
      if (socketId) {
        io.to(socketId).emit("stream:chunk", {
          chunk: chunk,
          fullText: fullResponse,
        });
      }
    };

    try {
      await generateResponseStream(messages, onChunk);

      if (!fullResponse || fullResponse.trim() === "") {
        fullResponse =
          "I need to search the internet for that, but my search tool isn't fully connected yet!";
        if (socketId) {
          io.to(socketId).emit("stream:chunk", {
            chunk: fullResponse,
            fullText: fullResponse,
          });
        }
      }

      // Save the complete AI message
      const aiMessage = await Message.create({
        chat: chat._id,
        role: "assistant",
        content: fullResponse,
      });

      // Signal completion
      if (socketId) {
        io.to(socketId).emit("stream:complete", {
          chatId: chat._id,
          messageId: aiMessage._id,
          finalMessage: fullResponse,
        });
      }

      return res.status(201).json({
        chatId: chat._id,
        title: chat.title,
        aimessage: aiMessage.content,
      });
    } catch (error) {
      if (socketId) {
        io.to(socketId).emit("stream:error", {
          error: error.message,
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

//fetch chats
async function getChats(req, res, next) {
  try {
    const user = req.user;

    const chats = await Chat.find({ user: user.id });

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

async function uploadFile(req, res, next) {
  try {

    const userId = req.user.id;
    if (!req.file) {
      const error = new Error("PDF file is required");
      error.statusCode = 400;
      throw error;
    }

    if (req.file.mimetype !== "application/pdf") {
      const error = new Error("Only PDF files are allowed");
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadFileToRAG(req.file, userId)


    res.status(200).json({
      success: true,
      message: "PDF processed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}


export async function askQuestion(req, res, next) {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    const answer = await answerQuestion(query, userId);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
}

export default { sendMessage, getChats, getMessages, deleteChat, uploadFile, askQuestion };
