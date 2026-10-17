import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export class AIService {
  async generateContent(
    prompt: string,
    systemInstruction?: string,
    _modelOverride?: string,
  ): Promise<{
    text: string;
    simulated: boolean;
    model: string;
  }> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMMA_MODEL?.trim() || "gemma-4-26b-a4b-it";

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is missing. Check .env and restart the server.",
      );
    }

    if (!prompt?.trim()) {
      throw new Error("Please enter a topic or prompt.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction:
          systemInstruction ||
          "You are Creova, an assistant for content creators. " +
            "Generate useful ideas, scripts, captions, hashtags, " +
            "and camera-angle suggestions based on the request.",
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemma returned an empty response. Please retry.");
    }

    console.log(`[CREOVA] Successful generation using ${model}`);

    return {
      text,
      simulated: false,
      model,
    };
  }

  async generateIdeas(topic: string, platform: string): Promise<string> {
    const result = await this.generateContent(
      `Generate 3 content ideas for ${platform} about "${topic}". ` +
        "For each provide a title, hook, content angle, and filming suggestions.",
    );
    return result.text;
  }

  async polishScript(hook: string, introduction: string): Promise<string> {
    const result = await this.generateContent(
      "Improve this video hook and introduction. " +
        "Return clearly labelled sections.\n\n" +
        `Hook: ${hook}\nIntroduction: ${introduction}`,
    );
    return result.text;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const result = await this.generateContent(
      `Translate this into ${targetLanguage}. ` +
        "Preserve the meaning and formatting. " +
        `Return only the translation:\n\n${text}`,
    );
    return result.text;
  }
}

export const aiService = new AIService();
