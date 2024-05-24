import { config } from "dotenv";
import express, { Request, Response } from "express";
import OpenAI from "openai";

//환경 변수 등 기본 설정
config();
const router = express.Router();
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//GPT 모델에게 하루 일과 피드백 요청하기
router.post(
  "/feedback",
  express.json(),
  async (req: Request, res: Response) => {
    const body = req.body;

    try {
      //요청할 파라미터 설정
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [
          {
            role: "system",
            content:
              "넌 탄소 배출량을 줄이기 위해 피드백을 해 주는 상담원이야. 아래 입력될 유저가 오늘 한 활동들에 대해, 탄소 배출량을 줄이기 위한 대안을 하나 마련해 줘. 50글자 이내로 답변해주면 좋겠어. 존댓말 쓰고, 가장 바꾸기 쉽고 탄소 배출량은 높은 활동 한두개만 뽑아서 그거 위주로 답변해줘.  ",
          },
          {
            role: "user",
            content: body.contents,
          },
        ],
        model: "gpt-3.5-turbo",
      };

      //OpenAI API 요창
      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await openAI.chat.completions.create(params);

      //응답 리턴
      res.status(200).json({
        message: "Successfully generated response from gpt-3.5-turbo",
        data: {
          contents: chatCompletion.choices[0].message.content,
        },
      });
    } catch (error) {
      //에러 발생 시 로그 작성 후 리턴
      res.status(400).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);
export default router;
