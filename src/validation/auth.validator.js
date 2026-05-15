import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({
        errors: errors.array(),
    });
};

export const authValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username field cannot be empty")
        .isString()
        .withMessage("username should be a string"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("It should be a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isString()
        .withMessage("password should be a string")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters"),
    validate,
];

export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("It should be a valid email")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("password is required"),
    validate,
];
