import express from "express";
import { createServer } from "http";
import { authroutes } from "./routes/auth";
import { propertyRoutes } from "./routes/property";
import { reservationRoutes } from "./routes/reservationsRoutes";
import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import cors from "cors";
import { handleWebSocket } from "./websocket/chatHandler";

dotenv.config();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });


app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("server is running");
});
app.use("/auth", authroutes);
app.use("/property", propertyRoutes);
app.use("/reservations", reservationRoutes);


wss.on('connection', handleWebSocket);

const port = process.env.PORT 

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});