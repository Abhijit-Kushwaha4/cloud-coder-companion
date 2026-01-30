import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  IDEState, 
  FileNode, 
  EditorTab, 
  EditorGroup, 
  SidebarPanelId, 
  IDESettings,
  StatusBarItem 
} from '@/types/ide';
import { getLanguageFromFilename } from '@/types/ide';

// Demo files for initial state
const createDemoFiles = (): FileNode[] => [
  {
    id: 'root',
    name: 'my-project',
    type: 'folder',
    path: '/',
    parentId: null,
    isOpen: true,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        path: '/src',
        parentId: 'root',
        isOpen: true,
        children: [
          {
            id: 'app-tsx',
            name: 'App.tsx',
            type: 'file',
            path: '/src/App.tsx',
            parentId: 'src',
            language: 'typescriptreact',
            content: `import React from 'react';
import { Button } from './components/Button';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">
          Welcome to VS Code++
        </h1>
      </header>
      <main className="p-8">
        <Button variant="primary">
          Get Started
        </Button>
      </main>
    </div>
  );
}

export default App;
`,
          },
          {
            id: 'main-tsx',
            name: 'main.tsx',
            type: 'file',
            path: '/src/main.tsx',
            parentId: 'src',
            language: 'typescriptreact',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
          },
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            parentId: 'src',
            isOpen: false,
            children: [
              {
                id: 'button-tsx',
                name: 'Button.tsx',
                type: 'file',
                path: '/src/components/Button.tsx',
                parentId: 'components',
                language: 'typescriptreact',
                content: `import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick,
  className 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:glow-blue',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        variant === 'ghost' && 'hover:bg-muted',
        className
      )}
    >
      {children}
    </button>
  );
}
`,
              },
            ],
          },
        ],
      },
      {
        id: 'package-json',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        parentId: 'root',
        language: 'json',
        content: `{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
`,
      },
      {
        id: 'readme-md',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        parentId: 'root',
        language: 'markdown',
        content: `# My Project

Welcome to your new project!

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- ⚡ Fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 📦 Type-safe with TypeScript
`,
      },
    ],
  },
];

const defaultSettings: IDESettings = {
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  tabSize: 2,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  autoSave: true,
  autoSaveDelay: 1000,
};

const defaultStatusBarItems: StatusBarItem[] = [
  { id: 'branch', label: 'main', icon: 'git-branch', position: 'left' },
  { id: 'sync', label: '↑0 ↓0', position: 'left' },
  { id: 'problems', label: '0 ⚠ 0 ✕', position: 'left' },
  { id: 'line', label: 'Ln 1, Col 1', position: 'right' },
  { id: 'encoding', label: 'UTF-8', position: 'right' },
  { id: 'language', label: 'TypeScript React', position: 'right' },
];

interface IDEStore extends IDEState {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setActiveSidebarPanel: (panel: SidebarPanelId) => void;
  
  // File actions
  setFiles: (files: FileNode[]) => void;
  toggleFolder: (folderId: string) => void;
  createFile: (parentId: string, name: string) => void;
  createFolder: (parentId: string, name: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  
  // Tab/Editor actions
  openFile: (file: FileNode) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  saveTab: (tabId: string) => void;
  
  // Command palette
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Settings
  updateSettings: (settings: Partial<IDESettings>) => void;
  
  // Status bar
  updateStatusBarItem: (id: string, label: string) => void;
}

export const useIDEStore = create<IDEStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarVisible: true,
      sidebarWidth: 260,
      activeSidebarPanel: 'explorer',
      editorGroups: [{
        id: 'main',
        tabs: [],
        activeTabId: null,
      }],
      activeGroupId: 'main',
      files: createDemoFiles(),
      openFiles: [],
      commandPaletteOpen: false,
      settings: defaultSettings,
      statusBarItems: defaultStatusBarItems,
      
      // Sidebar actions
      toggleSidebar: () => set(state => ({ sidebarVisible: !state.sidebarVisible })),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      setActiveSidebarPanel: (panel) => set({ activeSidebarPanel: panel }),
      
      // File actions
      setFiles: (files) => set({ files }),
      
      toggleFolder: (folderId) => set(state => {
        const toggleInTree = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === folderId && node.type === 'folder') {
              return { ...node, isOpen: !node.isOpen };
            }
            if (node.children) {
              return { ...node, children: toggleInTree(node.children) };
            }
            return node;
          });
        };
        return { files: toggleInTree(state.files) };
      }),
      
      createFile: (parentId, name) => set(state => {
        const newFile: FileNode = {
          id: `file-${Date.now()}`,
          name,
          type: 'file',
          path: `/${name}`,
          parentId,
          language: getLanguageFromFilename(name),
          content: '',
        };
        
        const addToTree = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === parentId && node.type === 'folder') {
              return {
                ...node,
                isOpen: true,
                children: [...(node.children || []), newFile],
              };
            }
            if (node.children) {
              return { ...node, children: addToTree(node.children) };
            }
            return node;
          });
        };
        
        return { files: addToTree(state.files) };
      }),
      
      createFolder: (parentId, name) => set(state => {
        const newFolder: FileNode = {
          id: `folder-${Date.now()}`,
          name,
          type: 'folder',
          path: `/${name}`,
          parentId,
          isOpen: false,
          children: [],
        };
        
        const addToTree = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === parentId && node.type === 'folder') {
              return {
                ...node,
                isOpen: true,
                children: [...(node.children || []), newFolder],
              };
            }
            if (node.children) {
              return { ...node, children: addToTree(node.children) };
            }
            return node;
          });
        };
        
        return { files: addToTree(state.files) };
      }),
      
      deleteFile: (fileId) => set(state => {
        const removeFromTree = (nodes: FileNode[]): FileNode[] => {
          return nodes
            .filter(node => node.id !== fileId)
            .map(node => {
              if (node.children) {
                return { ...node, children: removeFromTree(node.children) };
              }
              return node;
            });
        };
        
        // Also close any open tabs for this file
        const newOpenFiles = state.openFiles.filter(tab => tab.fileId !== fileId);
        const newEditorGroups = state.editorGroups.map(group => ({
          ...group,
          tabs: group.tabs.filter(tab => tab.fileId !== fileId),
          activeTabId: group.activeTabId === fileId ? 
            (group.tabs.find(t => t.fileId !== fileId)?.id || null) : 
            group.activeTabId,
        }));
        
        return { 
          files: removeFromTree(state.files),
          openFiles: newOpenFiles,
          editorGroups: newEditorGroups,
        };
      }),
      
      renameFile: (fileId, newName) => set(state => {
        const renameInTree = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === fileId) {
              return { 
                ...node, 
                name: newName,
                language: node.type === 'file' ? getLanguageFromFilename(newName) : undefined,
              };
            }
            if (node.children) {
              return { ...node, children: renameInTree(node.children) };
            }
            return node;
          });
        };
        
        // Also update any open tabs
        const newOpenFiles = state.openFiles.map(tab => 
          tab.fileId === fileId ? { ...tab, fileName: newName } : tab
        );
        
        return { 
          files: renameInTree(state.files),
          openFiles: newOpenFiles,
        };
      }),
      
      // Tab/Editor actions
      openFile: (file) => set(state => {
        if (file.type !== 'file') return state;
        
        // Check if already open
        const existingTab = state.openFiles.find(tab => tab.fileId === file.id);
        if (existingTab) {
          return {
            editorGroups: state.editorGroups.map(group => 
              group.id === state.activeGroupId 
                ? { ...group, activeTabId: existingTab.id }
                : group
            ),
          };
        }
        
        const newTab: EditorTab = {
          id: `tab-${Date.now()}`,
          fileId: file.id,
          fileName: file.name,
          filePath: file.path,
          language: file.language || 'plaintext',
          isDirty: false,
          content: file.content || '',
        };
        
        return {
          openFiles: [...state.openFiles, newTab],
          editorGroups: state.editorGroups.map(group =>
            group.id === state.activeGroupId
              ? { ...group, tabs: [...group.tabs, newTab], activeTabId: newTab.id }
              : group
          ),
        };
      }),
      
      closeTab: (tabId) => set(state => {
        const newOpenFiles = state.openFiles.filter(tab => tab.id !== tabId);
        const newEditorGroups = state.editorGroups.map(group => {
          const newTabs = group.tabs.filter(tab => tab.id !== tabId);
          let newActiveTabId = group.activeTabId;
          
          if (group.activeTabId === tabId) {
            const closedIndex = group.tabs.findIndex(t => t.id === tabId);
            newActiveTabId = newTabs[closedIndex]?.id || newTabs[closedIndex - 1]?.id || null;
          }
          
          return { ...group, tabs: newTabs, activeTabId: newActiveTabId };
        });
        
        return { openFiles: newOpenFiles, editorGroups: newEditorGroups };
      }),
      
      setActiveTab: (tabId) => set(state => ({
        editorGroups: state.editorGroups.map(group =>
          group.id === state.activeGroupId
            ? { ...group, activeTabId: tabId }
            : group
        ),
      })),
      
      updateTabContent: (tabId, content) => set(state => ({
        openFiles: state.openFiles.map(tab =>
          tab.id === tabId ? { ...tab, content, isDirty: true } : tab
        ),
        editorGroups: state.editorGroups.map(group => ({
          ...group,
          tabs: group.tabs.map(tab =>
            tab.id === tabId ? { ...tab, content, isDirty: true } : tab
          ),
        })),
      })),
      
      saveTab: (tabId) => set(state => {
        const tab = state.openFiles.find(t => t.id === tabId);
        if (!tab) return state;
        
        // Update file content in tree
        const updateInTree = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.id === tab.fileId) {
              return { ...node, content: tab.content };
            }
            if (node.children) {
              return { ...node, children: updateInTree(node.children) };
            }
            return node;
          });
        };
        
        return {
          files: updateInTree(state.files),
          openFiles: state.openFiles.map(t =>
            t.id === tabId ? { ...t, isDirty: false } : t
          ),
          editorGroups: state.editorGroups.map(group => ({
            ...group,
            tabs: group.tabs.map(t =>
              t.id === tabId ? { ...t, isDirty: false } : t
            ),
          })),
        };
      }),
      
      // Command palette
      toggleCommandPalette: () => set(state => ({ 
        commandPaletteOpen: !state.commandPaletteOpen 
      })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      
      // Settings
      updateSettings: (newSettings) => set(state => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      // Status bar
      updateStatusBarItem: (id, label) => set(state => ({
        statusBarItems: state.statusBarItems.map(item =>
          item.id === id ? { ...item, label } : item
        ),
      })),
    }),
    {
      name: 'vscode-plus-plus-ide',
      partialize: (state) => ({
        settings: state.settings,
        sidebarWidth: state.sidebarWidth,
        sidebarVisible: state.sidebarVisible,
      }),
    }
  )
);
