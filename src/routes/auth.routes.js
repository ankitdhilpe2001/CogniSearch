import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authValidation } from "../validation/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", authValidation, authController.handleRegister);

export default authRouter;
