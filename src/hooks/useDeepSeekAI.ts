// React Hook for DeepSeek-V3 AI Integration
import { useState, useCallback } from 'react';
import {
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
  runImproveReadability,
  type AIMessage,
  type AIResponse
} from '@/lib/deepSeekClient';

export interface AIState {
  loading: boolean;
  error: string | null;
  output: string | null;
}

export const useDeepSeekAI = () => {
  const [state, setState] = useState<AIState>({
    loading: false,
    error: null,
    output: null
  });

  const [history, setHistory] = useState<AIMessage[]>([]);

  const executeWithState = useCallback(async (
    operation: () => Promise<AIResponse>
  ): Promise<AIResponse> => {
    setState({ loading: true, error: null, output: null });
    
    try {
      const result = await operation();
      
      if (result.success && result.data) {
        setState({ loading: false, error: null, output: result.data });
      } else {
        setState({ loading: false, error: result.error || 'Unknown error', output: null });
      }
      
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      setState({ loading: false, error: errorMsg, output: null });
      return { success: false, error: errorMsg };
    }
  }, []);

  // Chat with history
  const chat = useCallback(async (message: string) => {
    const newMessage: AIMessage = { role: 'user', content: message };
    const updatedHistory = [...history, newMessage];
    
    const result = await executeWithState(() => runChat(updatedHistory));
    
    if (result.success && result.data) {
      setHistory([...updatedHistory, { role: 'assistant', content: result.data }]);
    }
    
    return result;
  }, [history, executeWithState]);

  // Single query (no history)
  const query = useCallback(async (prompt: string) => {
    return executeWithState(() => runQuery(prompt));
  }, [executeWithState]);

  // Explain code
  const explainCode = useCallback(async (code: string, language?: string) => {
    return executeWithState(() => runExplain(code, language));
  }, [executeWithState]);

  // Fix code
  const fixCode = useCallback(async (code: string, errorMessage?: string) => {
    return executeWithState(() => runFix(code, errorMessage));
  }, [executeWithState]);

  // Refactor code
  const refactorCode = useCallback(async (code: string, instructions?: string) => {
    return executeWithState(() => runRefactor(code, instructions));
  }, [executeWithState]);

  // Generate tests
  const generateTests = useCallback(async (code: string, framework?: string) => {
    return executeWithState(() => runTests(code, framework));
  }, [executeWithState]);

  // Complete code
  const completeCode = useCallback(async (code: string, cursorPosition?: string) => {
    return executeWithState(() => runComplete(code, cursorPosition));
  }, [executeWithState]);

  // Generate code
  const generateCode = useCallback(async (description: string, language?: string) => {
    return executeWithState(() => runGenerate(description, language));
  }, [executeWithState]);

  // Convert code
  const convertCode = useCallback(async (code: string, fromLang: string, toLang: string) => {
    return executeWithState(() => runConvert(code, fromLang, toLang));
  }, [executeWithState]);

  // Optimize code
  const optimizeCode = useCallback(async (code: string) => {
    return executeWithState(() => runOptimize(code));
  }, [executeWithState]);

  // Document code
  const documentCode = useCallback(async (code: string) => {
    return executeWithState(() => runDocument(code));
  }, [executeWithState]);

  // Summarize file
  const summarizeFile = useCallback(async (code: string, fileName?: string) => {
    return executeWithState(() => runSummarize(code, fileName));
  }, [executeWithState]);

  // Terminal fix
  const fixTerminalError = useCallback(async (errorOutput: string, command?: string) => {
    return executeWithState(() => runTerminalFix(errorOutput, command));
  }, [executeWithState]);

  // Suggest command
  const suggestCommand = useCallback(async (description: string) => {
    return executeWithState(() => runSuggestCommand(description));
  }, [executeWithState]);

  // Global scan
  const scanProject = useCallback(async (
    projectContext: string, 
    scanType: 'bugs' | 'security' | 'performance' | 'improvements'
  ) => {
    return executeWithState(() => runGlobalScan(projectContext, scanType));
  }, [executeWithState]);

  // Generate project
  const generateProject = useCallback(async (projectType: string, options?: Record<string, any>) => {
    return executeWithState(() => runProjectGenerator(projectType, options));
  }, [executeWithState]);

  // Find dead code
  const findDeadCode = useCallback(async (code: string) => {
    return executeWithState(() => runFindDeadCode(code));
  }, [executeWithState]);

  // Improve readability
  const improveReadability = useCallback(async (code: string) => {
    return executeWithState(() => runImproveReadability(code));
  }, [executeWithState]);

  // Clear state
  const clearState = useCallback(() => {
    setState({ loading: false, error: null, output: null });
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Reset all
  const reset = useCallback(() => {
    clearState();
    clearHistory();
  }, [clearState, clearHistory]);

  return {
    // State
    ...state,
    history,
    
    // Chat operations
    chat,
    query,
    
    // Code operations
    explainCode,
    fixCode,
    refactorCode,
    generateTests,
    completeCode,
    generateCode,
    convertCode,
    optimizeCode,
    documentCode,
    summarizeFile,
    findDeadCode,
    improveReadability,
    
    // Terminal operations
    fixTerminalError,
    suggestCommand,
    
    // Project operations
    scanProject,
    generateProject,
    
    // Utilities
    clearState,
    clearHistory,
    reset
  };
};

export default useDeepSeekAI;
