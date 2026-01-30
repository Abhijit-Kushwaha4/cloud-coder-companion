
import Bytez from "bytez.js";

const BYTEZ_API_KEY = "2622dd06541127bea7641c3ad0ed8859";
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

export const runAIQuery = async (prompt) => {
  try {
    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err) {
    return { success: false, error: err.message || "AI query failed" };
  }
};

export const runCodeRefactor = async (code) => {
  try {
    const prompt = `Refactor the following code to improve readability, performance, and best practices. Return only the refactored code without explanations:\n\n${code}`;
    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err) {
    return { success: false, error: err.message || "Code refactor failed" };
  }
};

export const explainCode = async (code) => {
  try {
    const prompt = `Explain what this code does in simple terms. Break down the logic step by step:\n\n${code}`;
    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err) {
    return { success: false, error: err.message || "Code explanation failed" };
  }
};

export const fixErrors = async (text) => {
  try {
    const prompt = `Fix all errors and issues in the following code. Return the corrected version:\n\n${text}`;
    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err) {
    return { success: false, error: err.message || "Error fixing failed" };
  }
};

export const generateCode = async (description) => {
  try {
    const prompt = `Generate clean, production-ready code based on this description:\n\n${description}`;
    const model = initializeBytez();
    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err) {
    return { success: false, error: err.message || "Code generation failed" };
  }
};