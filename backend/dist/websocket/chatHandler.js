"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebSocket = void 0;
// src/websocket/chatHandler.ts
const ws_1 = require("ws");
const prisma_1 = require("../db/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clients = new Map();
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded.userId;
    }
    catch (error) {
        return null;
    }
};
const broadcastToRoom = (roomId, message, sender) => {
    clients.forEach((client) => {
        if (client.roomId === roomId && client !== sender && client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};
const handleWebSocket = (ws) => __awaiter(void 0, void 0, void 0, function* () {
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = JSON.parse(data);
            switch (message.type) {
                case 'join': {
                    if (!message.token || !message.roomId) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Invalid join request' }));
                        return;
                    }
                    const userId = verifyToken(message.token);
                    if (!userId) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
                        return;
                    }
                    // Verify room access
                    const chatRoom = yield prisma_1.prisma.chatRoom.findFirst({
                        where: {
                            id: message.roomId,
                            OR: [
                                { hostId: userId },
                                { guestId: userId }
                            ]
                        }
                    });
                    if (!chatRoom) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Room access denied' }));
                        return;
                    }
                    ws.userId = userId;
                    ws.roomId = message.roomId;
                    clients.set(userId, ws);
                    // Send chat history
                    const messages = yield prisma_1.prisma.message.findMany({
                        where: { chatRoomId: message.roomId },
                        include: {
                            sender: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'asc' }
                    });
                    ws.send(JSON.stringify({
                        type: 'history',
                        messages: messages
                    }));
                    break;
                }
                case 'message': {
                    if (!ws.userId || !ws.roomId || !message.content) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
                        return;
                    }
                    const newMessage = yield prisma_1.prisma.message.create({
                        data: {
                            content: message.content,
                            senderId: ws.userId,
                            chatRoomId: ws.roomId
                        },
                        include: {
                            sender: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    });
                    const messageData = {
                        type: 'message',
                        message: newMessage
                    };
                    // Send to sender
                    ws.send(JSON.stringify(messageData));
                    // Broadcast to others in room
                    broadcastToRoom(ws.roomId, messageData, ws);
                    break;
                }
            }
        }
        catch (error) {
            console.error('WebSocket error:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
        }
    }));
    ws.on('close', () => {
        if (ws.userId) {
            clients.delete(ws.userId);
        }
    });
});
exports.handleWebSocket = handleWebSocket;
const interval = setInterval(() => {
    clients.forEach((ws) => {
        if (ws.isAlive === false) {
            clients.delete(ws.userId);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);
