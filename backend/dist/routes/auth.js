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
exports.authroutes = void 0;
const express_1 = require("express");
const types_1 = require("../types/types");
const prisma_1 = require("../db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authroutes = (0, express_1.Router)();
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
exports.authroutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: "Validation Error",
            erorrs: parsedData.error.errors,
        });
        return;
    }
    const checkUser = yield prisma_1.prisma.user.findUnique({
        where: {
            email: parsedData.data.email,
        },
    });
    if (checkUser) {
        res.status(400).json({
            msg: "User already exits",
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(parsedData.data.password, 10);
    const user = yield prisma_1.prisma.user.create({
        data: {
            email: parsedData.data.email,
            firstName: parsedData.data.firstName,
            lastName: parsedData.data.lastName,
            hashedPassword: hashedPassword,
            phoneNum: parsedData.data.phoneNum,
            profession: parsedData.data.profession,
        },
    });
    res.status(200).json({ user });
}));
exports.authroutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const parsedData = types_1.LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ msg: "Validation error" });
        return;
    }
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.email,
        },
    });
    if (!user) {
        res.status(400).json({ msg: "User doesnot exist" });
        return;
    }
    const check = yield bcrypt_1.default.compare((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password, user === null || user === void 0 ? void 0 : user.hashedPassword);
    if (!check) {
        res.status(400).json({
            msg: "Password wrong'",
        });
        return;
    }
    const username = user.firstName + " " + user.lastName;
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, username: username }, secret);
    res.status(200).json({ token });
}));
