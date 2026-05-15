import User from "../models/user.model.js";

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

        return res.status(201).json({
            message: "User registered successfully",
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
