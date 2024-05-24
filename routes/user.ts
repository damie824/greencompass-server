import { config } from "dotenv";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//환경 변수 등 기본 설정
config();
const router = express.Router();
const prismaClient = new PrismaClient();

router.get("/new", async (req: Request, res: Response) => {
  try {
    const key = await prismaClient.apiKey.create({
      data: {
        usable: true,
      },
    });

    res.status(200).json({
      message: `successfully generated new api key.`,
      data: key.id,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default router;
