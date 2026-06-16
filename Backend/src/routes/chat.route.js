import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import chatController from "../controllers/chat.controller.js"
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      const error = new Error("Only PDF files are allowed");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});
const chatRouter = Router();

chatRouter.post("/message", authenticateUser, chatController.sendMessage);

chatRouter.post("/upload", authenticateUser, upload.single("file"), chatController.uploadFile);

chatRouter.post("/ask", authenticateUser, chatController.askQuestion);

chatRouter.get("/", authenticateUser, chatController.getChats);

chatRouter.get("/:chatId/messages", authenticateUser, chatController.getMessages);

chatRouter.delete("/delete/:chatId", authenticateUser, chatController.deleteChat);

export default chatRouter;
