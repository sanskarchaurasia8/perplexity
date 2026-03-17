// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY
// });

// /chat gpt bala niche hai 

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let model;
if (process.env.GEMINI_API_KEY) {
  model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
  });
}

export const testAi = async () => {
  if (!model) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await model.invoke("Hello");
  console.log(response.content);
};