import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const template = `
  You are Jack, a friendly and concise AI assistant.
  IMPORTANT: Keep your response SHORT and BRIEF - maximum 1-2 sentences.
  Respond with exactly 1 message in JSON format:
  \n{format_instructions}.
  Respond naturally and conversationally, but stay concise.
  Facial expressions: smile, sad, angry, surprised, funnyFace, default.
  Animations: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake.
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  ["human", "{question}"],
]);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "-",
  modelName: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  temperature: 0.2,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const geminiChain = prompt.pipe(model).pipe(parser);

export { geminiChain, parser };
