// /src/components/AIConsole.jsx
import React, { useState } from 'react';
import { useBytezAI } from '../hooks/useBytezAI';

export const AIConsole = () => {
  const [inputText, setInputText] = useState('');
  const { loading, error, output, executeAIQuery, clearState } = useBytezAI();

  const handleRun = async () => {
    if (!inputText.trim()) {
      return;
    }
    await executeAIQuery(inputText);
  };

  const handleClear = () => {
    setInputText('');
    clearState();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleRun();
    }
  };

  return (
    <div className="ai-console-container">
      <style>{`
        .ai-console-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #1e1e1e;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .ai-console-header {
          margin-bottom: 16px;
        }

        .ai-console-header h2 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .ai-console-header p {
          color: #a0a0a0;
          margin: 0;
          font-size: 14px;
        }

        .ai-console-input-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .ai-console-textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          border-radius: 4px;
          color: #ffffff;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          resize: vertical;
        }

        .ai-console-textarea:focus {
          outline: none;
          border-color: #007acc;
        }

        .ai-console-button-group {
          display: flex;
          gap: 12px;
        }

        .ai-console-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-console-button-primary {
          background: #007acc;
          color: #ffffff;
        }

        .ai-console-button-primary:hover:not(:disabled) {
          background: #005a9e;
        }

        .ai-console-button-secondary {
          background: #3d3d3d;
          color: #ffffff;
        }

        .ai-console-button-secondary:hover:not(:disabled) {
          background: #4d4d4d;
        }

        .ai-console-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-console-output-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          border-radius: 4px;
          overflow: hidden;
        }

        .ai-console-output-header {
          padding: 12px;
          background: #252525;
          border-bottom: 1px solid #3d3d3d;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
        }

        .ai-console-output-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .ai-console-loading {
          color: #007acc;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-console-spinner {
          border: 3px solid #3d3d3d;
          border-top: 3px solid #007acc;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ai-console-error {
          color: #f48771;
          background: #3d2626;
          padding: 12px;
          border-radius: 4px;
          border-left: 4px solid #f48771;
        }

        .ai-console-output-text {
          color: #d4d4d4;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .ai-console-empty {
          color: #a0a0a0;
          text-align: center;
          padding: 40px;
        }
      `}</style>

      <div className="ai-console-header">
        <h2>AI Console</h2>
        <p>Powered by Qwen3-Coder-480B via Bytez.js</p>
      </div>

      <div className="ai-console-input-section">
        <textarea
          className="ai-console-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your prompt here... (Ctrl+Enter to run)"
          disabled={loading}
        />
        <div className="ai-console-button-group">
          <button
            className="ai-console-button ai-console-button-primary"
            onClick={handleRun}
            disabled={loading || !inputText.trim()}
          >
            {loading ? 'Running...' : 'Run Query'}
          </button>
          <button
            className="ai-console-button ai-console-button-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="ai-console-output-section">
        <div className="ai-console-output-header">Output</div>
        <div className="ai-console-output-content">
          {loading && (
            <div className="ai-console-loading">
              <div className="ai-console-spinner"></div>
              <span>Processing your request...</span>
            </div>
          )}
          {error && (
            <div className="ai-console-error">
              <strong>Error:</strong> {error}
            </div>
          )}
          {!loading && !error && output && (
            <div className="ai-console-output-text">{output}</div>
          )}
          {!loading && !error && !output && (
            <div className="ai-console-empty">
              No output yet. Run a query to see results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};