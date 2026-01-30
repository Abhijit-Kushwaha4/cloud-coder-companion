import { useEffect, useRef } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { useIDEStore } from '@/stores/ideStore';
import { Loader2 } from 'lucide-react';

export function MonacoEditor() {
  const { 
    editorGroups, 
    activeGroupId, 
    openFiles,
    updateTabContent,
    saveTab,
    settings,
    updateStatusBarItem
  } = useIDEStore();
  
  const editorRef = useRef<any>(null);
  
  const activeGroup = editorGroups.find(g => g.id === activeGroupId);
  const activeTab = activeGroup?.tabs.find(t => t.id === activeGroup.activeTabId);
  const activeFile = openFiles.find(f => f.id === activeTab?.id);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure VS Code-like keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeTab) {
        saveTab(activeTab.id);
      }
    });
    
    // Update cursor position in status bar
    editor.onDidChangeCursorPosition((e) => {
      updateStatusBarItem('line', `Ln ${e.position.lineNumber}, Col ${e.position.column}`);
    });
    
    // Set dark theme
    monaco.editor.defineTheme('vscode-plus-plus', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editor.inactiveSelectionBackground': '#264f7855',
      },
    });
    
    monaco.editor.setTheme('vscode-plus-plus');
  };

  const handleChange: OnChange = (value) => {
    if (activeTab && value !== undefined) {
      updateTabContent(activeTab.id, value);
    }
  };

  // Update language in status bar
  useEffect(() => {
    if (activeFile) {
      const languageMap: Record<string, string> = {
        'typescript': 'TypeScript',
        'typescriptreact': 'TypeScript React',
        'javascript': 'JavaScript',
        'javascriptreact': 'JavaScript React',
        'json': 'JSON',
        'html': 'HTML',
        'css': 'CSS',
        'markdown': 'Markdown',
        'python': 'Python',
      };
      updateStatusBarItem('language', languageMap[activeFile.language] || activeFile.language);
    }
  }, [activeFile?.language, updateStatusBarItem]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-editor">
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4 opacity-20">{'</>'}</div>
          <p className="text-lg">Select a file to start editing</p>
          <p className="text-sm mt-2">Use the file explorer on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        height="100%"
        language={activeFile.language}
        value={activeFile.content}
        onChange={handleChange}
        onMount={handleEditorMount}
        loading={
          <div className="flex items-center justify-center h-full bg-editor">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
        options={{
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          tabSize: settings.tabSize,
          wordWrap: settings.wordWrap ? 'on' : 'off',
          minimap: { enabled: settings.minimap },
          lineNumbers: settings.lineNumbers ? 'on' : 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
        }}
      />
    </div>
  );
}
