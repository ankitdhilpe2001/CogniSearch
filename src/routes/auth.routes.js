import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, authController.handleRegister);

export default authRouter;
