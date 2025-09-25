const express = require("express");
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req:any, res:any) => {
  try {
    const { userId, zapId } = req.params;
    const body = req.body;

    await client.$transaction(async (tx) => {
      const run = await tx.zapRun.create({
        data: {
          zapId: zapId,
          metaData: body, 
        },
      });
      await tx.zapRunOutBox.create({
        data: {
          zapRunId: run.id,
        },
      });

      res.status(201).json({ message: "Hook created successfully", hook: run });
    });
  } catch (error) {
    console.error("Error fetching hooks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});