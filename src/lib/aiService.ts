import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const civicAssistant = async (prompt: string, chatHistory: any[] = []) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are DemocraAI India, an intelligent civic assistant dedicated to helping Indian citizens understand Lok Sabha, Rajya Sabha, State Assembly, and Municipal elections. 
  Your expertise includes:
  - Election Commission of India (ECI) processes and Form 6 registration.
  - EVM, VVPAT, and NOTA concepts.
  - Model Code of Conduct (MCC).
  - Indian political landscape (National and Regional parties).
  
  Provide accurate, non-partisan information. Support multilingual queries in English, Hindi, and Kannada.
  If asked about specific candidates or parties, remain neutral and focus on public records or stated manifestos.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...chatHistory,
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction,
    },
  });

  return response.text;
};

export const detectFakeNews = async (newsText: string) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are an elite Indian Fact-Checking AI specialized in identifying fake news and political misinformation within the Indian democratic context (IT Cell myths, doctored videos, misleading election claims).
  Analyze the provided text and strictly return a JSON object with:
  - label: "Real", "Fake", or "Misleading"
  - confidence: a number from 0 to 1
  - reasoning: a brief explanation of why you gave this label in the context of Indian facts/history.
  - keyPoints: a list of facts verified or debunked.
  
  Be objective and thorough. Support analysis of news in Indian languages.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Analyze this news text: "${newsText}"` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["label", "confidence", "reasoning"]
      }
    },
  });

  return JSON.parse(response.text || "{}");
};
