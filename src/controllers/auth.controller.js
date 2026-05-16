import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

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

export default {
    handleRegister,
};
