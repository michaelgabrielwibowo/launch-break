import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

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

// REST API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    has_api_key: !!key && key !== "MY_GEMINI_API_KEY",
  });
});

// 1. AI Chat Endpoint for academic tutoring
app.post("/api/ai/chat", async (req, res) => {
  const { message, history, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Fallback if AI not initialized
  if (!ai) {
    return res.json({
      text: `### AI Offline Assistant (No API Key Detected)\n\nI see you are interested in **${context?.topic || "Learning"}**, especially the concept of "***${message}***".\n\nTo enable live explanations, quizzes, and real-time research paper summaries powered by Gemini, please add your **GEMINI_API_KEY** in the Secrets settings in Google AI Studio.\n\n*Offline Quick Summary:*\n* Machine Learning focuses on algorithmic systems making predictions from statistical patterns.\n* In statistical learning, models map raw features to targets using supervised, unsupervised, or reinforcement regimes.`,
    });
  }

  try {
    const systemInstruction = `You are "Academic Assistant", the official expert study and research tutor for Learning Launchpad.
You provide precise, dense, technical but clear educational tutoring in markdown formatting.
Always use appropriate headers, bullet points, and codeblocks where relevant. Keep explanations focused and clean.
Current academic context: ${JSON.stringify(context || {})}`;

    // Construct simple contents format
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "No response received." });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI service." });
  }
});

// 2. AI dynamic quiz generation based on topic
app.post("/api/ai/quiz", async (req, res) => {
  const { topic, difficulty } = req.body;
  const targetTopic = topic || "Machine Learning";
  const targetDifficulty = difficulty || "Intermediate";

  if (!ai) {
    return res.json({
      fallback: true,
      questions: [
        {
          id: 1,
          question: `In supervised learning, what is the primary role of the training labels?`,
          options: [
            "To act as independent features for training weight regularizations",
            "To provide the ground-truth targets that the loss function minimizes against",
            "To control the learning rate decay schedule",
            "To regularize high-frequency noise spikes in input dimensions"
          ],
          answerIndex: 1,
          explanation: "In supervised learning, labels are the ground-truth values used alongside predicted values to calculate loss and guide coefficient optimizations through backpropagation."
        },
        {
          id: 2,
          question: `Which of the following describes L1 regularization (Lasso)?`,
          options: [
            "Adds a penalty proportional to the square of weights, reducing extreme values",
            "Forces some weight coefficients to exactly zero, producing sparse models",
            "Directly scales learning rate gradient iterations",
            "Performs dimensional normalization on inner layers"
          ],
          answerIndex: 1,
          explanation: "Lasso adds an absolute sum penalty (L1 norm) which drives some feature coefficients to absolute zero, serving a built-in feature selection function."
        },
        {
          id: 3,
          question: `What primary issue does Gradient Clipping address during deep net optimization?`,
          options: [
            "Overfitting on sparse input features",
            "Vanishing gradients in sigmoid states",
            "Exploding gradients where gradient steps become overly large and destabilize parameters",
            "Loss of stochastic random search properties"
          ],
          answerIndex: 2,
          explanation: "Gradient clipping scales down gradients when their norm exceeds a specified threshold to prevent destabilization (exploding gradients)."
        }
      ]
    });
  }

  try {
    const prompt = `Generate an interactive academic quiz with exactly 4 multiple choice questions about "${targetTopic}" at a "${targetDifficulty}" level.
Return the output as a clean JSON array adhering to the specified schema. Dont wrap it in markdown code headers, just release raw parsed json.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  answerIndex: { type: Type.INTEGER, description: "0-indexed index of the correct answer from the options array." },
                  explanation: { type: Type.STRING, description: "Detailed academic explanation of why this answer is correct." }
                },
                required: ["id", "question", "options", "answerIndex", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const quizData = JSON.parse(response.text || '{"questions":[]}');
    res.json(quizData);
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate dynamic quiz." });
  }
});

// Setup Vite Dev Server / Static Hosting Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Academic Workspace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
