"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET || "";
const wss = new ws_1.default.Server({ port: 8080 });
wss.on('connection', (ws, req) => {
    var _a;
    console.log('New client connected');
    const token = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('token=')[1];
    if (!token) {
        ws.send('No token provided');
        ws.close();
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decoded.username) {
            throw new Error("Invalid token: username missing");
        }
        console.log(`User connected: ${decoded.username}`);
        ws.send('Authentication successful');
    }
    catch (error) {
        ws.send('Authentication failed');
        ws.close();
    }
});
