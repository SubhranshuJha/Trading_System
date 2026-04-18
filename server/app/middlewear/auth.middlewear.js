import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import blackListToken from '../models/blackListToken.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const isBlacklisted = await blackListToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. Token is blacklisted."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. User not found."
            });
        }

        req.user = user;
        req.id = user._id;

        next();

    } catch (error) {
        console.log("Auth Error:", error.message);

        return res.status(401).json({
            success: false,
            message: error.name === "TokenExpiredError"
                ? "Token expired"
                : "Invalid token"
        });
    }
};

export default authMiddleware;