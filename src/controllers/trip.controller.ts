import { Request, Response } from "express";
import axios from "axios";
import { env } from "../config/env";
import { sendError, sendSuccess } from "../services/api.response.util";

export const generateTrip = async (req: Request, res: Response) => {
  try {
    const { text, maxToken } = req.body;

    // Call to Google Gemini API
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text }],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxToken || 150,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": env.GEMINI_API_KEY,
        },
      }
    );

    // Extract generated content from the response
    const genratedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data";

    console.log(res);
    sendSuccess(res, 200, "Trip generated successfully", genratedContent);

  } catch (error) {

    console.error("Error generating content:", error);
    sendError(res, 500, "Failed to generate a trip");
  }
};
