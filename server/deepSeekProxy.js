// DeepSeek-V3 AI Proxy Server via Bytez.js
// Secure backend endpoint for AI operations

import express from 'express';
import cors from 'cors';
import Bytez from 'bytez.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "2622dd06541127bea7641c3ad0ed8859";
const MODEL_NAME = "deepseek-ai/DeepSeek-V3-0324";

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
  if (input.length > 100000) {
    throw new Error('Input exceeds maximum length of 100000 characters');
  }
  return input.trim();
};

// Main AI endpoint - supports chat with history
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

// Code explanation endpoint
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const langHint = language ? ` (${language})` : '';
    const prompt = `Explain the following code${langHint} in detail. Break down what each part does, the logic flow, and any important patterns:\n\n\`\`\`${language || ''}\n${sanitizedCode}\n\`\`\``;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are an expert code educator. Provide clear, comprehensive explanations.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Explain API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Code fixing endpoint
app.post('/api/ai/fix', async (req, res) => {
  try {
    const { code, errorMessage } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const errorContext = errorMessage ? `\n\nError message:\n${errorMessage}` : '';
    const prompt = `Fix the following code. Identify all bugs and issues, then provide the corrected version with explanations:\n\n\`\`\`\n${sanitizedCode}\n\`\`\`${errorContext}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are an expert debugger. Find and fix all issues in the code.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Fix API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Code refactoring endpoint
app.post('/api/ai/refactor', async (req, res) => {
  try {
    const { code, instructions } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const additionalInstructions = instructions ? `\n\nSpecific requirements: ${instructions}` : '';
    const prompt = `Refactor the following code to improve readability, performance, and best practices:${additionalInstructions}\n\n\`\`\`\n${sanitizedCode}\n\`\`\``;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are a senior software architect. Refactor code to be elegant and maintainable.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Refactor API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Test generation endpoint
app.post('/api/ai/tests', async (req, res) => {
  try {
    const { code, framework } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const sanitizedCode = sanitizeInput(code);
    const frameworkHint = framework ? ` using ${framework}` : '';
    const prompt = `Generate comprehensive unit tests${frameworkHint} for the following code. Include edge cases and error scenarios:\n\n\`\`\`\n${sanitizedCode}\n\`\`\``;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are a test automation expert. Generate thorough, well-structured tests.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Tests API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Terminal error analysis endpoint
app.post('/api/ai/terminal', async (req, res) => {
  try {
    const { errorOutput, command } = req.body;

    if (!errorOutput) {
      return res.status(400).json({
        success: false,
        error: 'Terminal error output is required'
      });
    }

    const sanitizedError = sanitizeInput(errorOutput);
    const cmdContext = command ? `Command executed: ${command}\n\n` : '';
    const prompt = `${cmdContext}Analyze this terminal error and provide a solution:\n\n${sanitizedError}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are a DevOps expert. Analyze terminal errors and provide clear, actionable solutions.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Terminal API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Project generation endpoint
app.post('/api/ai/generate-project', async (req, res) => {
  try {
    const { projectType, options } = req.body;

    if (!projectType) {
      return res.status(400).json({
        success: false,
        error: 'Project type is required'
      });
    }

    const sanitizedType = sanitizeInput(projectType);
    const optionsStr = options ? `\n\nOptions: ${JSON.stringify(options, null, 2)}` : '';
    const prompt = `Generate a complete ${sanitizedType} project boilerplate with all necessary files and configurations. Include package.json, main entry files, folder structure, and basic components.${optionsStr}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are a project scaffolding expert. Generate complete, production-ready project templates.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Project Generation API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Global code scan endpoint
app.post('/api/ai/scan', async (req, res) => {
  try {
    const { projectContext, scanType } = req.body;

    if (!projectContext) {
      return res.status(400).json({
        success: false,
        error: 'Project context is required'
      });
    }

    const sanitizedContext = sanitizeInput(projectContext);
    const scanDescriptions = {
      bugs: "Scan for potential bugs, logic errors, and edge cases",
      security: "Scan for security vulnerabilities and unsafe practices",
      performance: "Scan for performance issues and optimization opportunities",
      improvements: "Scan for code quality improvements and modernization opportunities"
    };

    const scanDesc = scanDescriptions[scanType] || scanDescriptions.improvements;
    const prompt = `${scanDesc}:\n\n${sanitizedContext}`;

    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: 'system', content: 'You are a senior code reviewer. Provide thorough, actionable feedback.' },
      { role: 'user', content: prompt }
    ]);

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.json({ success: true, data: output });

  } catch (err) {
    console.error('Scan API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    model: MODEL_NAME,
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`DeepSeek-V3 AI Proxy Server running on port ${PORT}`);
  console.log(`Model: ${MODEL_NAME}`);
});

export default app;
