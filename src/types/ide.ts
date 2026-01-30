// IDE Core Types

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  parentId: string | null;
  children?: FileNode[];
  content?: string;
  language?: string;
  isOpen?: boolean;
  isDirty?: boolean;
}

export interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  language: string;
  isDirty: boolean;
  content: string;
}

export interface EditorGroup {
  id: string;
  tabs: EditorTab[];
  activeTabId: string | null;
}

export interface SidebarPanel {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: string;
  action: () => void;
}

export interface IDESettings {
  theme: 'dark' | 'light' | 'synthwave';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
}

export type SidebarPanelId = 'explorer' | 'search' | 'git' | 'extensions' | 'ai-chat';

export interface IDEState {
  sidebarVisible: boolean;
  sidebarWidth: number;
  activeSidebarPanel: SidebarPanelId;
  editorGroups: EditorGroup[];
  activeGroupId: string;
  files: FileNode[];
  openFiles: EditorTab[];
  commandPaletteOpen: boolean;
  settings: IDESettings;
  statusBarItems: StatusBarItem[];
}

export interface StatusBarItem {
  id: string;
  label: string;
  icon?: string;
  position: 'left' | 'right';
  onClick?: () => void;
}

// File type to language mapping
export const FILE_EXTENSIONS: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescriptreact',
  '.js': 'javascript',
  '.jsx': 'javascriptreact',
  '.json': 'json',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.less': 'less',
  '.md': 'markdown',
  '.py': 'python',
  '.rs': 'rust',
  '.go': 'go',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.rb': 'ruby',
  '.php': 'php',
  '.sql': 'sql',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.xml': 'xml',
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.dockerfile': 'dockerfile',
  '.gitignore': 'ignore',
  '.env': 'dotenv',
};

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.'));
  return FILE_EXTENSIONS[ext.toLowerCase()] || 'plaintext';
}

// File icons mapping
export const FILE_ICONS: Record<string, string> = {
  typescript: 'file-code',
  typescriptreact: 'file-code',
  javascript: 'file-code',
  javascriptreact: 'file-code',
  json: 'file-json',
  html: 'file-code',
  css: 'file-code',
  markdown: 'file-text',
  python: 'file-code',
  rust: 'file-code',
  go: 'file-code',
  java: 'file-code',
  default: 'file',
  folder: 'folder',
  'folder-open': 'folder-open',
};
