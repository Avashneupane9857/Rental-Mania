// src/websocket/chatHandler.ts
import { WebSocket, WebSocketServer } from 'ws';
import { prisma } from '../db/prisma';
import jwt from 'jsonwebtoken';

interface WebSocketClient extends WebSocket {
    userId?: string;
    roomId?: string;
    isAlive?: boolean;
}

interface ChatMessage {
    type: 'join' | 'message' | 'error';
    roomId?: string;
    content?: string;
    token?: string;
}

const clients = new Map<string, WebSocketClient>();

const verifyToken = (token: string): string | null => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jwt.verify(token, secret) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

const broadcastToRoom = (roomId: string, message: any, sender?: WebSocketClient) => {
    clients.forEach((client) => {
        if (client.roomId === roomId && client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

export const handleWebSocket = async (ws: WebSocketClient) => {
    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', async (data: string) => {
        try {
            const message: ChatMessage = JSON.parse(data);

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
                    const chatRoom = await prisma.chatRoom.findFirst({
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
                    const messages = await prisma.message.findMany({
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

                    const newMessage = await prisma.message.create({
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
        } catch (error) {
            console.error('WebSocket error:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
        }
    });

    ws.on('close', () => {
        if (ws.userId) {
            clients.delete(ws.userId);
        }
    });
};

const interval = setInterval(() => {
    clients.forEach((ws) => {
        if (ws.isAlive === false) {
            clients.delete(ws.userId!);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);