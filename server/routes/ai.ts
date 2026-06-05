import { Router } from "express";
import { aiLimiter } from "../middleware/rateLimit";
import { validateBody } from "../middleware/validate";
import { chatRequestSchema, quizRequestSchema } from "../schemas/ai";
import { ai, Type } from "../services/gemini";

export const aiRouter = Router();

// Hook up validation and rate-limiting
aiRouter.post("/chat", aiLimiter, validateBody(chatRequestSchema), async (req, res) => {
  const { message, context } = req.body;

  // Fallback if AI not initialized
  if (!ai) {
    return res.json({
      text: `### AI Offline Assistant (No API Key Detected)\n\nI see you are interested in **${context?.topic || "Learning"}**, especially the concept of "***${message}***".\n\nTo enable live explanations, quizzes, and real-time research paper summaries powered by Gemini, please add your **GEMINI_API_KEY** in the Secrets settings in Google AI Studio.\n\n*Offline Quick Summary:*\n* Machine Learning focuses on algorithmic systems making predictions from statistical patterns.\n* In statistical learning, models map raw features to targets using supervised, unsupervised, or reinforcement regimes.`,
    });
  }

  try {
    // Sanitize context parameters - avoid custom client instructions injection
    const allowedTabs = new Set([
      "home",
      "topics",
      "resources",
      "papers",
      "saved",
      "practice",
      "progress",
      "settings",
      "github",
      "help",
    ]);

    const activeTab =
      typeof context?.activeTab === "string" && allowedTabs.has(context.activeTab)
        ? context.activeTab
        : "unknown";

    const safeContext = {
      appName: "Learning Launchpad",
      activeTab,
      topic: typeof context?.topic === "string" ? context.topic.slice(0, 100) : "unknown",
      category: typeof context?.category === "string" ? context.category.slice(0, 100) : "unknown",
    };

    const systemInstruction = `You are "Academic Assistant", the official expert study and research tutor for Learning Launchpad.
You provide precise, dense, technical but clear educational tutoring in markdown formatting.
Always use appropriate headers, bullet points, and codeblocks where relevant. Keep explanations focused and clean.
Current safe context parameters: ${JSON.stringify(safeContext)}`;

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
    res.status(500).json({ error: "Academic service is currently unavailable. Please try again later." });
  }
});

aiRouter.post("/quiz", aiLimiter, validateBody(quizRequestSchema), async (req, res) => {
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
    res.status(500).json({ error: "Failed to generate dynamic quiz." });
  }
});
