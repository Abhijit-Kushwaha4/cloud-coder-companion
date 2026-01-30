// /server/bytezProxy.js
import express from 'express';
import cors from 'cors';
import Bytez from 'bytez.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "2622dd06541127bea7641c3ad0ed8859";
const MODEL_NAME = "Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8";

let sdkInstance = null;
let modelInstance = null;

const initializeBytez = () => {
  if (!sdkInstance) {
    sdkInstance = new Bytez(BYTEZ_API_KEY);
  }
  if (!modelInstance) {
    modelInstance = sdkInstance.model(MODEL_NAME);
  }
  return modelInstance;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  if (input.length > 50000) {
    throw new Error('Input exceeds maximum length of 50000 characters');
  }
  return input.trim();
};

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, messages } = req.body;

    if (!prompt && !messages) {
      return res.status(400).json({
        success: false,
        error: 'Either prompt or messages array is required'
      });
    }

    let messagesToSend;

    if (messages && Array.isArray(messages)) {
      messagesToSend = messages.map(msg => ({
        role: msg.role || 'user',
        content: sanitizeInput(msg.content || '')
      }));
    } else {
      const sanitizedPrompt = sanitizeInput(prompt);
      messagesToSend = [{ role: 'user', content: sanitizedPrompt }];
    }

    const model = initializeBytez();
    const { error, output } = await model.run(messagesToSend);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }

    return res.json({
      success: true,
      data: output
    });

  } catch (err) {
    console.error('AI API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.post('/api/ai/refactor', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const prompt = `Refactor the following code to improve readability, performance, and best practices. Return only the refactored code without explanations:\n\n${sanitizedCode}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }

    return res.json({
      success: true,
      data: output
    });

  } catch (err) {
    console.error('Refactor API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.post('/api/ai/explain', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const prompt = `Explain what this code does in simple terms. Break down the logic step by step:\n\n${sanitizedCode}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }

    return res.json({
      success: true,
      data: output
    });

  } catch (err) {
    console.error('Explain API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.post('/api/ai/fix', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    const sanitizedText = sanitizeInput(text);
    const prompt = `Fix all errors and issues in the following code. Return the corrected version:\n\n${sanitizedText}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      });
    }

    return res.json({
      success: true,
      data: output
    });

  } catch (err) {
    console.error('Fix API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Bytez AI Proxy Server running on port ${PORT}`);
});

export default app;