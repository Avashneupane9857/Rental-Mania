"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(400).json({ msg: "No auth header" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ msg: "JWT_SECRET is not defined in the environment variables" });
        return;
    }
    try {
        const token = authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({ msg: "Token is missing or invalid format" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.username = decoded.username;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ msg: "Invalid token" });
            return;
        }
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
};
exports.middleware = middleware;
