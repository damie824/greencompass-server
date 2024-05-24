import { config } from "dotenv";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//환경 변수 등 기본 설정
config();
const router = express.Router();
const prismaClient = new PrismaClient();

//탄소 발생량 기록 추가
router.get("/new", async (req: Request, res: Response) => {
  const body: {
    title: string;
    unit: string;
  } = req.body;
  try {
    const newData = await prismaClient.carbonUsage.create({
      data: {
        title: body.title,
        amount: 0,
        unit: body.unit,
      },
    });

    res.status(200).json({
      message: `successfully generated new carbon-usage data.`,
      data: newData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default router;
