// /src/hooks/useBytezAI.js
import { useState, useCallback } from 'react';
import {
  runAIQuery,
  runCodeRefactor,
  explainCode,
  fixErrors,
  generateCode
} from '../lib/bytezClient';

export const useBytezAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState(null);

  const executeAIQuery = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    try {
      const result = await runAIQuery(prompt);
      if (result.success) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const refactorCode = useCallback(async (code) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    try {
      const result = await runCodeRefactor(code);
      if (result.success) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const explainCodeLogic = useCallback(async (code) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    try {
      const result = await explainCode(code);
      if (result.success) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fixCodeErrors = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    try {
      const result = await fixErrors(text);
      if (result.success) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCodeFromDescription = useCallback(async (description) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    try {
      const result = await generateCode(description);
      if (result.success) {
        setOutput(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setLoading(false);
    setError(null);
    setOutput(null);
  }, []);

  return {
    loading,
    error,
    output,
    executeAIQuery,
    refactorCode,
    explainCodeLogic,
    fixCodeErrors,
    generateCodeFromDescription,
    clearState
  };
};