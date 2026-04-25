import jwt from 'jsonwebtoken';
import blackListToken from '../models/blackListToken.model.js';
import companyModel from '../models/componey.model.js';

const companyAuthMiddleware = async (req, res, next) => {
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

        const company = await companyModel.findById(decoded.id).select("-password");
        if (!company) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. Company not found."
            });
        }

        req.user = company;
        req.id = company._id;

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

export default companyAuthMiddleware;