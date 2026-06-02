import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken"


async function handleRegister(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const user = await User.create({ username, email, password });

    const payload = {
      id: user._id
    }

    const emailVerificationtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })

    let emailSent = true;
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Welcome to Perplexity 🚀</h2>
          
                <p>Hi <strong>${username}</strong>,</p>
          
                <p>
                  Thank you for registering with <strong>Perplexity</strong>!
                </p>
          
                <p>
                  We're excited to have you on board 🎉
                </p>

                <p>
                  Please verify your account by clicking the Link below 👇
                  <a href="http://localhost:8080/api/auth/verify-email?token=${emailVerificationtoken}">Verify your email here</a>
                  If you didn’t create this account, ignore this email
                </p>
          
          
                <p>
                  If you have any questions or need support,
                  feel free to reach out anytime.
                </p>
          
                <br />
          
                <p>Happy exploring!</p>
          
                <p>
                  Best regards,<br />
                  <strong>The Perplexity Team</strong>
                </p>
              </div>
            `,
      });
    } catch (emailErr) {
      emailSent = false;
      console.error("Welcome email failed:", emailErr.message);
    }

    return res.status(201).json({
      message: emailSent
        ? "User registered successfully"
        : "User registered successfully, but welcome email could not be sent",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function handleVerifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token — user not found" });
    }

    if (user.verified) {
      return res.send(`
              <h1>Already verified</h1>
              <p>Your email is already verified. You can log in to your account.</p>
            `);
    }

    user.verified = true;
    await user.save();

    return res.send(`
          <h1>Email verified successfully</h1>
          <p>Your email has been verified. You can now log in to your account.</p>
        `);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }
    next(error);
  }
}

async function handleLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordMatch = await user.comparePassword(password);
        //comparePassword is defined by you in user.model.js
        // userSchema.methods.comparePassword adds a custom instance method on every user document from MongoDB

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                message: "Please verify your account before logging in",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProduction =
            process.env.NODE_ENV === "production" ||
            process.env.NODE_ENVIRONMENT === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function handleGetMe(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User found",
            user,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    handleRegister,
    handleVerifyEmail,
    handleLogin,
    handleGetMe
};
