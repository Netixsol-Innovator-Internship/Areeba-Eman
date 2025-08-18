import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errors } from "../utils/responses.js";

dotenv.config();

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: errors.NO_TOKEN });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded JWT:", decoded);
        req.user = { id: decoded.id || decoded._id }; // store whole payload, not just id
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: errors.INVALID_TOKEN });
    }
};
