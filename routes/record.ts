import { config } from "dotenv";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//환경 변수 등 기본 설정
config();
const router = express.Router();
const prismaClient = new PrismaClient();

//이용 가능한 활동 검색
router.get(
  "/find/:param",
  express.json(),
  async (req: Request, res: Response) => {
    const param = req.params.param;
    try {
      const found = await prismaClient.carbonUsage.findMany({
        where: {
          title: { contains: param },
        },
      });

      res.status(200).json({
        message: `successfully got ${found.length} datas.`,
        data: found,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

router.get(
  "/get/:userKey",
  express.json(),
  async (req: Request, res: Response) => {
    const apiKey = req.params.userKey;

    try {
      const foundKey = await prismaClient.apiKey.findUnique({
        where: {
          id: apiKey,
        },
      });
      if (!foundKey) {
        throw new Error("Key not found.");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 날짜의 자정으로 설정

      const foundActivites = await prismaClient.activities.findMany({
        where: {
          apiKeyId: apiKey,
          createdAt: {
            gte: new Date(), // 오늘 생성된 데이터만 필터링
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          carbonUsage: true,
        },
      });
      res.status(200).json({
        message: `successfully got ${foundActivites.length} datas.`,
        data: foundActivites,
      });
    } catch (error) {
      res.status(400).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);

router.post("/new", express.json(), async (req: Request, res: Response) => {
  const body: {
    apiKey: string;
    title: string;
    carbonId: number;
    amount: number;
  } = req.body;

  try {
    const apiKey = await prismaClient.apiKey.findUnique({
      where: {
        id: body.apiKey,
      },
    });
    const carbonUsage = await prismaClient.carbonUsage.findUnique({
      where: {
        id: body.carbonId,
      },
    });
    if (!apiKey || !carbonUsage) {
      throw new Error("API key or Carbon Usage ID is missing");
    }
    const newData = await prismaClient.activities.create({
      data: {
        title: body.title,
        apiKeyId: apiKey.id,
        createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
        carbonUsageId: carbonUsage.id,
        amount: body.amount,
      },
    });

    res.status(200).json({
      message: "Successfully created new record.",
      error: newData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default router;
