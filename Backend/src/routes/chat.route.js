import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import chatController from "../controllers/chat.controller.js"


const chatRouter = Router();

chatRouter.post("/message", authenticateUser, chatController.sendMessage)

chatRouter.get("/", authenticateUser, chatController.getChats);

chatRouter.get("/:chatId/messages", authenticateUser, chatController.getMessages);

chatRouter.delete("/delete/:chatId", authenticateUser, chatController.deleteChat);

export default chatRouter;