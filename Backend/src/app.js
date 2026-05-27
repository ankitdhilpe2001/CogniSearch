import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import handleError from "./middleware/error.middleware.js";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT", "DELETE"]
}))

app.get("/", (req, res) => {
    return res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

app.use(handleError);

export default app;