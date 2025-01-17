"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const auth_1 = require("./routes/auth");
const property_1 = require("./routes/property");
const reservationsRoutes_1 = require("./routes/reservationsRoutes");
const ws_1 = require("ws");
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const chatHandler_1 = require("./websocket/chatHandler");
dotenv.config();
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("server is running");
});
app.use("/auth", auth_1.authroutes);
app.use("/property", property_1.propertyRoutes);
app.use("/reservations", reservationsRoutes_1.reservationRoutes);
wss.on('connection', chatHandler_1.handleWebSocket);
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
