import WebSocket from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

const secretKey = process.env.JWT_SECRET || "";
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

wss.on('connection', (ws, req: Request) => {
    console.log('New client connected');

    const token = req.url?.split('token=')[1]; // Use optional chaining to prevent undefined errors

    if (!token) {
        ws.send('No token provided');
        ws.close();
        return;
    }

    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload; // Explicitly cast to JwtPayload

        if (!decoded.username) {
            throw new Error("Invalid token: username missing");
        }

        console.log(`User connected: ${decoded.username}`);
        ws.send('Authentication successful');
    } catch (error) {
        ws.send('Authentication failed');
        ws.close();
    }
});
