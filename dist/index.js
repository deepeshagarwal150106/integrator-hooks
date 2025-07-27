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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const client_1 = require("@prisma/client");
const app = express();
app.use(express.json());
const client = new client_1.PrismaClient();
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, zapId } = req.params;
        const body = req.body;
        yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const run = yield tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metaData: body,
                },
            });
            yield tx.zapRunOutBox.create({
                data: {
                    zapRunId: run.id,
                },
            });
            res.status(201).json({ message: "Hook created successfully", hook: run });
        }));
    }
    catch (error) {
        console.error("Error fetching hooks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
