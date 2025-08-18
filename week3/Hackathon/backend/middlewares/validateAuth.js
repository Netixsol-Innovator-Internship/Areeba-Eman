// middlewares/validateAuth.js
import { errors } from "../utils/responses.js";

// ===== Validate Registration =====
export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: errors.VALIDATION_ERROR });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: errors.INVALID_EMAIL });
    }

    // Password length check
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    next();
};

// ===== Validate Login =====
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: errors.INVALID_CREDENTIALS });
    }

    next();
};
