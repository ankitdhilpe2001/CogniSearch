import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { loginValidation, registerValidation } from "../validation/auth.validator.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, authController.handleRegister);

authRouter.post("/login", loginValidation, authController.handleLogin);

authRouter.get("/verify-email",authController.handleVerifyEmail );

authRouter.get("/get-me",authenticateUser, authController.handleGetMe)

export default authRouter;
