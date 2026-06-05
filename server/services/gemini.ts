import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../env";

let ai: GoogleGenAI | null = null;
const key = env.GEMINI_API_KEY;

if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini AI loaded successfully in full-stack mode.");
  } catch (err) {
    console.error("Error initializing GoogleGenAI client:", err);
  }
} else {
  console.log("No active GEMINI_API_KEY found. Running in offline fallback mode.");
}

export { ai, key, Type };
