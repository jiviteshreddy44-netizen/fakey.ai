const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Use CORS to allow your frontend (usually localhost:3000 or similar) to access this server
app.use(cors());
app.use(express.json());

// Set up Multer to store uploaded files in memory for immediate processing
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Endpoint: Deepfake & Forensic Media Analysis
 */
app.post('/api/analyze-media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Upgrade to Gemini 3 Pro for high-quality complex forensic reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      // Fix: Follow guidelines for multimodal GenerateContentParameters (single object for contents)
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: "Act as a deepfake forensic expert. Analyze this media for synthetic artifacts, lighting inconsistencies, and biometric anomalies. Generate a structured JSON report. Fields: verdict (REAL, LIKELY_FAKE, UNCERTAIN), confidence (0-100), manipulationType, summary, guidance, explanations (array of {point, detail, category, timestamp}). Output raw JSON only." }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Forensic Engine Error:', error);
    res.status(500).json({ error: 'Deepfake analysis failed. Check server logs.' });
  }
});

/**
 * Endpoint: AI Detection & Fact Verification
 */
app.post('/api/analyze-text', async (req, res) => {
  const { text, mode } = req.body;

  try {
    const isFactCheck = mode === 'FACT_CHECK';
    const model = isFactCheck ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    const config = {
      responseMimeType: "application/json",
      systemInstruction: isFactCheck 
        ? "You are a world-class fact-checker. Verify the claims in the text using Google Search. Return JSON with 'claims' array and a 'summary'. Each claim needs 'status', 'claim', 'sourceUrl'."
        : "You are a forensic linguist. Detect if the text is AI-generated. Return JSON with 'aiProbability', 'verdictLabel', 'aiSignals', 'humanSignals', 'summary'."
    };

    if (isFactCheck) {
      config.tools = [{ googleSearch: {} }];
      config.thinkingConfig = { thinkingBudget: 16000 };
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: text,
      config: config
    });

    const result = JSON.parse(response.text);
    
    // Enrich with grounding URLs if available
    if (isFactCheck && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      result.sources = response.candidates[0].groundingMetadata.groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web.title,
          url: chunk.web.uri
        }));
    }

    res.json(result);
  } catch (error) {
    console.error('Text Interrogator Error:', error);
    res.status(500).json({ error: 'Text analysis failed.' });
  }
});

app.listen(port, () => {
  console.log(`
  =========================================
  FAKEY.AI BACKEND STATUS: OPERATIONAL
  URL: http://localhost:${port}
  MODE: Neural Forensic Suite
  =========================================
  `);
});