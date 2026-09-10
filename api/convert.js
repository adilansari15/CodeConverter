import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
error: error?.message || "Failed to generate response",    });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.status(200).json({
      result: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      error: "Failed to generate response",
    });
  }
}