// /src/pages/AIDemo.jsx
import React, { useState } from 'react';
import { AIConsole } from '../components/AIConsole';
import { useBytezAI } from '../hooks/useBytezAI';

export const AIDemo = () => {
  const [codeInput, setCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState('console');
  
  const {
    loading,
    error,
    output,
    refactorCode,
    explainCodeLogic,
    fixCodeErrors,
    generateCodeFromDescription,
    clearState
  } = useBytezAI();

  const handleRefactor = async () => {
    if (!codeInput.trim()) return;
    await refactorCode(codeInput);
  };

  const handleExplain = async () => {
    if (!codeInput.trim()) return;
    await explainCodeLogic(codeInput);
  };

  const handleFix = async () => {
    if (!codeInput.trim()) return;
    await fixCodeErrors(codeInput);
  };

  const handleGenerate = async () => {
    if (!codeInput.trim()) return;
    await generateCodeFromDescription(codeInput);
  };

  const handleClear = () => {
    setCodeInput('');
    clearState();
  };

  return (
    <div className="ai-demo-container">
      <style>{`
        .ai-demo-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1a1a;
          color: #ffffff;
        }

        .ai-demo-header {
          padding: 20px 40px;
          background: #252525;
          border-bottom: 2px solid #007acc;
        }

        .ai-demo-header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          color: #ffffff;
        }

        .ai-demo-header p {
          margin: 0;
          color: #a0a0a0;
          font-size: 14px;
        }

        .ai-demo-tabs {
          display: flex;
          gap: 4px;
          padding: 0 40px;
          background: #252525;
          border-bottom: 1px solid #3d3d3d;
        }

        .ai-demo-tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #a0a0a0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .ai-demo-tab:hover {
          color: #ffffff;
          background: #2d2d2d;
        }

        .ai-demo-tab.active {
          color: #007acc;
          border-bottom-color: #007acc;
        }

        .ai-demo-content {
          flex: 1;
          padding: 20px 40px;
          overflow-y: auto;
        }

        .ai-demo-actions-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ai-demo-section {
          background: #1e1e1e;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .ai-demo-section h3 {
          margin: 0 0 16px 0;
          color: #ffffff;
          font-size: 18px;
        }

        .ai-demo-textarea {
          width: 100%;
          min-height: 200px;
          padding: 12px;
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          border-radius: 4px;
          color: #ffffff;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          resize: vertical;
          margin-bottom: 16px;
        }

        .ai-demo-textarea:focus {
          outline: none;
          border-color: #007acc;
        }

        .ai-demo-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ai-demo-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-demo-button-primary {
          background: #007acc;
          color: #ffffff;
        }

        .ai-demo-button-primary:hover:not(:disabled) {
          background: #005a9e;
        }

        .ai-demo-button-secondary {
          background: #3d3d3d;
          color: #ffffff;
        }

        .ai-demo-button-secondary:hover:not(:disabled) {
          background: #4d4d4d;
        }

        .ai-demo-button-success {
          background: #16a34a;
          color: #ffffff;
        }

        .ai-demo-button-success:hover:not(:disabled) {
          background: #15803d;
        }

        .ai-demo-button-warning {
          background: #ea580c;
          color: #ffffff;
        }

        .ai-demo-button-warning:hover:not(:disabled) {
          background: #c2410c;
        }

        .ai-demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-demo-output {
          background: #2d2d2d;
          border: 1px solid #3d3d3d;
          border-radius: 4px;
          padding: 16px;
          margin-top: 16px;
          max-height: 400px;
          overflow-y: auto;
        }

        .ai-demo-loading {
          color: #007acc;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-demo-spinner {
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

        .ai-demo-error {
          color: #f48771;
          background: #3d2626;
          padding: 12px;
          border-radius: 4px;
          border-left: 4px solid #f48771;
        }

        .ai-demo-output-text {
          color: #d4d4d4;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .ai-demo-empty {
          color: #a0a0a0;
          text-align: center;
          padding: 40px;
        }
      `}</style>

      <div className="ai-demo-header">
        <h1>Cloud Coder Companion - AI Demo</h1>
        <p>AI-powered coding assistance with Qwen3-Coder-480B</p>
      </div>

      <div className="ai-demo-tabs">
        <button
          className={`ai-demo-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          AI Console
        </button>
        <button
          className={`ai-demo-tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Code Actions
        </button>
      </div>

      <div className="ai-demo-content">
        {activeTab === 'console' && <AIConsole />}
        
        {activeTab === 'actions' && (
          <div className="ai-demo-actions-panel">
            <div className="ai-demo-section">
              <h3>Code Input</h3>
              <textarea
                className="ai-demo-textarea"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Paste your code here or describe what you want to generate..."
                disabled={loading}
              />
              <div className="ai-demo-buttons">
                <button
                  className="ai-demo-button ai-demo-button-primary"
                  onClick={handleExplain}
                  disabled={loading || !codeInput.trim()}
                >
                  Explain Code
                </button>
                <button
                  className="ai-demo-button ai-demo-button-success"
                  onClick={handleRefactor}
                  disabled={loading || !codeInput.trim()}
                >
                  Refactor Code
                </button>
                <button
                  className="ai-demo-button ai-demo-button-warning"
                  onClick={handleFix}
                  disabled={loading || !codeInput.trim()}
                >
                  Fix Errors
                </button>
                <button
                  className="ai-demo-button ai-demo-button-primary"
                  onClick={handleGenerate}
                  disabled={loading || !codeInput.trim()}
                >
                  Generate Code
                </button>
                <button
                  className="ai-demo-button ai-demo-button-secondary"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="ai-demo-section">
              <h3>AI Output</h3>
              <div className="ai-demo-output">
                {loading && (
                  <div className="ai-demo-loading">
                    <div className="ai-demo-spinner"></div>
                    <span>Processing your request...</span>
                  </div>
                )}
                {error && (
                  <div className="ai-demo-error">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                {!loading && !error && output && (
                  <div className="ai-demo-output-text">{output}</div>
                )}
                {!loading && !error && !output && (
                  <div className="ai-demo-empty">
                    Select an action above to see AI-generated results
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDemo;