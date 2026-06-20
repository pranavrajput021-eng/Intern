import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client safely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY_FOR_DEV_WITHOUT_CRASHING_ON_STARTUP",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API route first
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Dev offline fallback responses in case API key is not ready yet
      const fallbackReplies = [
        "Consistency is the ultimate hypertrophic catalyst. Keep tracking your metrics closely!",
        "Ensure your recovery protocols are meeting your workload. Let's focus on proper sleep.",
        "That query aligns perfectly with our training methodologies. Focus on high physical intensity today.",
        "Be sure you are logging your daily hydration. Recovery starts before you leave the weight room."
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ reply: `[Offline Mode] ${randomReply}` });
    }

    const systemInstruction = 
      "You are the 'Aesthetic Athlete Coach AI', an elite bodybuilding coach, sports scientist, and performance nutritionist.\n\n" +
      "CRITICAL LIMITATION RULE:\n" +
      "1. You MUST ONLY discuss physical fitness, workout routines, gym exercises, bodybuilding splits, stretching, muscle hypertrophy, cardio routines, physical health, target nutrition, caloric counts, meal preps, hydration, sleep, and recovery.\n" +
      "2. If the user asks a question about general programming/coding, mathematics, software, writing essays, literature, booking travel, historic events not about sports/bodybuilding, news, weather, or other general assistant tasks, you MUST decline to answer.\n" +
      "   - Decline politely but firmly, saying something like: 'As your dedicated Aesthetic Athlete Coach, I focus exclusively on physical training, target nutrition, and athletic performance. For questions beyond bodybuilding, fitness, and recovery, please consult a generic AI assistant.'\n" +
      "3. Style your responses professionally, with a clean, motivational, aesthetic tone. Use bullet points for structured exercises and keep it highly visual and engaging.";

    // Structure previous conversation context to maintain memory
    let promptContext = "";
    if (history && Array.isArray(history)) {
      const limitedHistory = history.slice(-10);
      for (const h of limitedHistory) {
        if (h.role && h.text) {
          promptContext += `${h.role === "model" ? "Coach" : "Athlete"}: ${h.text}\n`;
        }
      }
    }
    promptContext += `Athlete: ${message}\nCoach:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Apologies, my physiological CPU experienced a metabolic delay. Let's restart our workout set.";
    return res.json({ reply });

  } catch (err: any) {
    console.error("Coach AI assistant error:", err);
    return res.status(500).json({ error: "Assistant process failed. Re-run set." });
  }
});

// Vite middleware configuration for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
