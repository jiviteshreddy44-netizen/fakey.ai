
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Verdict, TextAnalysisResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fixed: Implement generateSyntheticImage using gemini-2.5-flash-image as per guidelines
export const generateSyntheticImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from model");
};

// Fixed: Implement generateSyntheticVideo using veo-3.1-fast-generate-preview as per guidelines
export const generateSyntheticVideo = async (prompt: string): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed or URI not found.");
  
  // Appending API key for fetch as required by guidelines
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateForensicCertificate = async (result: AnalysisResult): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed plain text forensic analysis report for a Notepad (.txt) file based on this data: ${JSON.stringify(result)}. 
    The report must be strictly text-only, formatted with ASCII dividers (e.g., ====================).
    Include:
    1. CASE FILE ID
    2. FINAL VERDICT (REAL or FAKE)
    3. AI-LIKELIHOOD SCORE
    4. TECHNICAL EVIDENCE LOG (Metadata, Visual, Temporal findings)
    5. INVESTIGATOR GUIDANCE
    6. SYSTEM SIGNATURE
    
    Ensure it looks like a professional command-line or system log output.`,
  });
  return response.text || "Failed to generate text report.";
};

export const reverseSignalGrounding = async (file: File): Promise<any> => {
  const ai = getAI();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: file.type, data: base64Data } },
        { text: "Find the original source of this image using Google Search. Return JSON: {summary, originalEvent, manipulationDetected, confidence, findings: [{type, detail}]}" }
      ]
    },
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });

  const rawText = response.text || "{}";
  const data = JSON.parse(rawText.trim());
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({ title: chunk.web?.title || "Verified Source", url: chunk.web?.uri || "" })) || [];

  return { ...data, sources };
};

export const analyzeMedia = async (file: File, metadata: any): Promise<AnalysisResult> => {
  const ai = getAI();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: file.type, data: base64Data } },
        { text: "Perform an exhaustive forensic analysis of this media. Output a JSON object with: verdict (STRICTLY 'REAL' or 'LIKELY_FAKE'), deepfakeProbability (0-100 score where 100 means definitely AI), confidence (0-100 model certainty), summary, userRecommendation, analysisSteps (integrity, consistency, aiPatterns, temporal), explanations (array with point, detail, simpleDetail, category, timestamp), manipulationType, guidance." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  const data = JSON.parse((response.text || "{}").trim());
  
  // Enforce definite verdict logic
  let finalVerdict = Verdict.LIKELY_FAKE; 
  if (data.verdict === 'REAL' && (data.deepfakeProbability ?? 0) < 50) {
    finalVerdict = Verdict.REAL;
  } else if (data.deepfakeProbability > 50) {
    finalVerdict = Verdict.LIKELY_FAKE;
  } else if (data.verdict === 'REAL') {
    finalVerdict = Verdict.REAL;
  }

  return {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    timestamp: Date.now(),
    verdict: finalVerdict,
    confidence: data.confidence ?? 50,
    confidenceLevel: (data.confidence > 85 ? 'High' : data.confidence < 50 ? 'Low' : 'Medium') as any,
    deepfakeProbability: data.deepfakeProbability ?? 50,
    summary: data.summary || "Forensic analysis complete.",
    userRecommendation: data.userRecommendation || "Verify manually.",
    analysisSteps: data.analysisSteps || {
      integrity: { score: 50, explanation: "Analyzing...", confidenceQualifier: "Medium" },
      consistency: { score: 50, explanation: "Analyzing...", confidenceQualifier: "Medium" },
      aiPatterns: { score: 50, explanation: "Analyzing...", confidenceQualifier: "Medium" },
      temporal: { score: 50, explanation: "Analyzing...", confidenceQualifier: "Medium" }
    },
    explanations: Array.isArray(data.explanations) ? data.explanations : [],
    manipulationType: data.manipulationType || "Digital Synthesis",
    guidance: data.guidance || "Caution advised.",
    fileMetadata: metadata
  };
};

export const analyzeText = async (text: string, mode: 'AI_DETECT' | 'FACT_CHECK'): Promise<TextAnalysisResult> => {
  const ai = getAI();
  const isFactCheck = mode === 'FACT_CHECK';
  const response = await ai.models.generateContent({
    model: isFactCheck ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
    contents: text,
    config: {
      responseMimeType: "application/json",
      systemInstruction: isFactCheck 
        ? "Verify claims using Google Search. Return JSON: {claims: [{claim, status, sourceUrl, category}], summary}"
        : "Detect AI text. Return JSON: {aiProbability, verdictLabel, aiSignals, humanSignals, summary, linguisticMarkers}",
      tools: isFactCheck ? [{ googleSearch: {} }] : [],
      thinkingConfig: isFactCheck ? { thinkingBudget: 16000 } : undefined
    }
  });

  const result = JSON.parse((response.text || "{}").trim());
  return {
    likelihoodRange: result.aiProbability ? `${result.aiProbability}%` : "0%",
    aiProbability: result.aiProbability ?? 0,
    verdictLabel: result.verdictLabel || "STRICT",
    ambiguityNote: "",
    aiSignals: result.aiSignals || [],
    humanSignals: result.humanSignals || [],
    isFactual: result.isFactual ?? 'STRICT',
    summary: result.summary || "Analysis complete.",
    claims: result.claims || [],
    linguisticMarkers: result.linguisticMarkers || [],
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web).map(chunk => ({ title: chunk.web?.title || "Source", url: chunk.web?.uri || "" })) || []
  };
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const ai = getAI();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(audioBlob);
  });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "audio/wav", data: base64Data } },
        { text: "Transcribe this audio accurately." }
      ]
    }
  });
  return response.text || "Transcription failed.";
};

export const startAssistantChat = () => getAI().chats.create({
  model: 'gemini-3-pro-preview',
  config: {
    systemInstruction: 'You are the FAKEY.AI Forensic Assistant. Use Google Search for news/facts. Professional tone.',
    tools: [{ googleSearch: {} }],
    thinkingConfig: { thinkingBudget: 16000 }
  }
});
