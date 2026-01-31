// DeepSeek-V3 AI Client via Bytez.js
// This client provides AI capabilities throughout the IDE

import Bytez from "bytez.js";

const BYTEZ_API_KEY = "2622dd06541127bea7641c3ad0ed8859";
const MODEL_NAME = "deepseek-ai/DeepSeek-V3-0324";

let sdkInstance: any = null;
let modelInstance: any = null;

const initializeBytez = () => {
  if (!sdkInstance) {
    sdkInstance = new Bytez(BYTEZ_API_KEY);
  }
  if (!modelInstance) {
    modelInstance = sdkInstance.model(MODEL_NAME);
  }
  return modelInstance;
};

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Core chat function
export const runChat = async (messages: AIMessage[]): Promise<AIResponse> => {
  try {
    const model = initializeBytez();
    const { error, output } = await model.run(messages);
    
    if (error) {
      throw new Error(error);
    }
    
    return { success: true, data: output };
  } catch (err: any) {
    return { success: false, error: err.message || "AI chat failed" };
  }
};

// Simple query function
export const runQuery = async (prompt: string): Promise<AIResponse> => {
  return runChat([{ role: "user", content: prompt }]);
};

// Code explanation
export const runExplain = async (code: string, language?: string): Promise<AIResponse> => {
  const langHint = language ? ` (${language})` : '';
  const prompt = `Explain the following code${langHint} in detail. Break down what each part does, the logic flow, and any important patterns or concepts used:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are an expert code educator. Provide clear, comprehensive explanations that help developers understand code deeply." },
    { role: "user", content: prompt }
  ]);
};

// Code fixing and debugging
export const runFix = async (code: string, errorMessage?: string): Promise<AIResponse> => {
  const errorContext = errorMessage ? `\n\nError message:\n${errorMessage}` : '';
  const prompt = `Fix the following code. Identify all bugs, errors, and issues, then provide the corrected version with explanations of what was wrong:\n\n\`\`\`\n${code}\n\`\`\`${errorContext}`;
  
  return runChat([
    { role: "system", content: "You are an expert debugger. Find and fix all issues in the code. Always return the complete corrected code." },
    { role: "user", content: prompt }
  ]);
};

// Code refactoring
export const runRefactor = async (code: string, instructions?: string): Promise<AIResponse> => {
  const additionalInstructions = instructions ? `\n\nSpecific requirements: ${instructions}` : '';
  const prompt = `Refactor the following code to improve readability, performance, and best practices. Apply modern patterns and clean code principles:${additionalInstructions}\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a senior software architect. Refactor code to be elegant, maintainable, and performant. Return only the refactored code with brief comments explaining major changes." },
    { role: "user", content: prompt }
  ]);
};

// Generate tests
export const runTests = async (code: string, framework?: string): Promise<AIResponse> => {
  const frameworkHint = framework ? ` using ${framework}` : '';
  const prompt = `Generate comprehensive unit tests${frameworkHint} for the following code. Include edge cases, error scenarios, and happy paths:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a test automation expert. Generate thorough, well-structured tests with good coverage and meaningful assertions." },
    { role: "user", content: prompt }
  ]);
};

// Code completion
export const runComplete = async (code: string, cursorPosition?: string): Promise<AIResponse> => {
  const positionHint = cursorPosition ? ` The cursor is at: ${cursorPosition}` : '';
  const prompt = `Complete the following code. Provide natural, contextually appropriate code that follows the existing patterns and style:${positionHint}\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are an intelligent code completion engine. Provide concise, accurate completions that fit naturally with the existing code." },
    { role: "user", content: prompt }
  ]);
};

// Generate code from description
export const runGenerate = async (description: string, language?: string): Promise<AIResponse> => {
  const langHint = language ? ` in ${language}` : '';
  const prompt = `Generate clean, production-ready code${langHint} based on this description:\n\n${description}`;
  
  return runChat([
    { role: "system", content: "You are an expert programmer. Generate well-structured, documented code that follows best practices." },
    { role: "user", content: prompt }
  ]);
};

// Language conversion
export const runConvert = async (code: string, fromLang: string, toLang: string): Promise<AIResponse> => {
  const prompt = `Convert the following ${fromLang} code to ${toLang}. Maintain the same functionality and use idiomatic patterns for the target language:\n\n\`\`\`${fromLang}\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a polyglot programmer expert in language translation. Convert code accurately while using idiomatic patterns for the target language." },
    { role: "user", content: prompt }
  ]);
};

// Performance optimization
export const runOptimize = async (code: string): Promise<AIResponse> => {
  const prompt = `Optimize the following code for better performance. Identify bottlenecks and apply optimizations while maintaining correctness:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a performance optimization expert. Identify performance issues and apply optimizations with explanations of the improvements." },
    { role: "user", content: prompt }
  ]);
};

// Add documentation/comments
export const runDocument = async (code: string): Promise<AIResponse> => {
  const prompt = `Add comprehensive documentation and comments to the following code. Include JSDoc/docstrings, inline comments for complex logic, and a module overview:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a documentation expert. Add clear, helpful documentation that explains the what, why, and how of the code." },
    { role: "user", content: prompt }
  ]);
};

// Summarize file
export const runSummarize = async (code: string, fileName?: string): Promise<AIResponse> => {
  const fileContext = fileName ? ` (${fileName})` : '';
  const prompt = `Provide a concise summary of this code file${fileContext}. Include: purpose, main components/functions, dependencies, and key patterns used:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a code analyst. Provide clear, structured summaries that help developers quickly understand a codebase." },
    { role: "user", content: prompt }
  ]);
};

// Terminal error analysis
export const runTerminalFix = async (errorOutput: string, command?: string): Promise<AIResponse> => {
  const cmdContext = command ? `Command executed: ${command}\n\n` : '';
  const prompt = `${cmdContext}Analyze this terminal error and provide a solution:\n\n${errorOutput}`;
  
  return runChat([
    { role: "system", content: "You are a DevOps expert. Analyze terminal errors and provide clear, actionable solutions with the corrected commands." },
    { role: "user", content: prompt }
  ]);
};

// Suggest commands
export const runSuggestCommand = async (description: string): Promise<AIResponse> => {
  const prompt = `Suggest the terminal command(s) to: ${description}\n\nProvide the exact command(s) with a brief explanation.`;
  
  return runChat([
    { role: "system", content: "You are a command-line expert. Provide precise, safe commands with clear explanations." },
    { role: "user", content: prompt }
  ]);
};

// Project-wide scan
export const runGlobalScan = async (projectContext: string, scanType: 'bugs' | 'security' | 'performance' | 'improvements'): Promise<AIResponse> => {
  const scanDescriptions = {
    bugs: "Scan for potential bugs, logic errors, and edge cases that could cause issues",
    security: "Scan for security vulnerabilities, unsafe practices, and potential attack vectors",
    performance: "Scan for performance issues, memory leaks, and optimization opportunities",
    improvements: "Scan for code quality improvements, better patterns, and modernization opportunities"
  };
  
  const prompt = `${scanDescriptions[scanType]}:\n\n${projectContext}`;
  
  return runChat([
    { role: "system", content: "You are a senior code reviewer. Provide thorough, actionable feedback organized by priority and location in the code." },
    { role: "user", content: prompt }
  ]);
};

// Generate project boilerplate
export const runProjectGenerator = async (projectType: string, options?: Record<string, any>): Promise<AIResponse> => {
  const optionsStr = options ? `\n\nOptions: ${JSON.stringify(options, null, 2)}` : '';
  const prompt = `Generate a complete ${projectType} project boilerplate with all necessary files and configurations. Include package.json, main entry files, folder structure, and basic components.${optionsStr}`;
  
  return runChat([
    { role: "system", content: "You are a project scaffolding expert. Generate complete, production-ready project templates with best practices and modern tooling." },
    { role: "user", content: prompt }
  ]);
};

// Find dead code
export const runFindDeadCode = async (code: string): Promise<AIResponse> => {
  const prompt = `Analyze this code and identify any dead code, unused variables, unreachable branches, or deprecated patterns:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a static analysis expert. Identify dead code and unused elements with specific locations and removal suggestions." },
    { role: "user", content: prompt }
  ]);
};

// Improve readability
export const runImproveReadability = async (code: string): Promise<AIResponse> => {
  const prompt = `Improve the readability of this code. Focus on: better naming, clearer structure, reduced complexity, and enhanced clarity:\n\n\`\`\`\n${code}\n\`\`\``;
  
  return runChat([
    { role: "system", content: "You are a clean code advocate. Transform code to be more readable while maintaining functionality." },
    { role: "user", content: prompt }
  ]);
};

export default {
  runChat,
  runQuery,
  runExplain,
  runFix,
  runRefactor,
  runTests,
  runComplete,
  runGenerate,
  runConvert,
  runOptimize,
  runDocument,
  runSummarize,
  runTerminalFix,
  runSuggestCommand,
  runGlobalScan,
  runProjectGenerator,
  runFindDeadCode,
  runImproveReadability
};
