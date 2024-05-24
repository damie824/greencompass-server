import express, { Express, Request, Response } from "express";
import { config } from "dotenv";

import AIRouter from "./routes/openai";
import KeyRouter from "./routes/user";
import RecordsRouter from "./routes/record";
import CarbonRouter from "./routes/carbon";

// 환경 변수 불러오기
config();

const app: Express = express();

//메인 페이지 매핑
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Greencompass API Server.");
});

//라우터들 불러와 매핑
app.use("/api/ai", AIRouter);
app.use("/api/record", RecordsRouter);
app.use("/api/key", KeyRouter);
app.use("/api/carbons", CarbonRouter);

//서버 실행
app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at https://localhost:${process.env.PORT}`
  );
});
