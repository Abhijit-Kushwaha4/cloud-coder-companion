// Context Builder for AI Operations
// Collects workspace context for AI-aware operations

import { FileNode } from '@/types/ide';

export interface ProjectContext {
  files: FileNode[];
  currentFile?: FileNode;
  selectedCode?: string;
  dependencies?: Record<string, string>;
  projectType?: string;
  structure: string;
}

// Get file extension
const getExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
};

// Detect project type from files
export const detectProjectType = (files: FileNode[]): string => {
  const fileNames = files.map(f => f.name.toLowerCase());
  
  if (fileNames.includes('next.config.js') || fileNames.includes('next.config.ts')) {
    return 'Next.js';
  }
  if (fileNames.includes('vite.config.ts') || fileNames.includes('vite.config.js')) {
    return 'Vite/React';
  }
  if (fileNames.includes('angular.json')) {
    return 'Angular';
  }
  if (fileNames.includes('vue.config.js')) {
    return 'Vue.js';
  }
  if (fileNames.includes('requirements.txt') || fileNames.includes('pyproject.toml')) {
    return 'Python';
  }
  if (fileNames.includes('cargo.toml')) {
    return 'Rust';
  }
  if (fileNames.includes('go.mod')) {
    return 'Go';
  }
  if (fileNames.includes('package.json')) {
    return 'Node.js';
  }
  
  return 'Unknown';
};

// Build tree structure string
export const buildFileTreeString = (files: FileNode[], indent: number = 0): string => {
  let result = '';
  const prefix = '  '.repeat(indent);
  
  for (const file of files) {
    if (file.type === 'folder') {
      result += `${prefix}📁 ${file.name}/\n`;
      if (file.children) {
        result += buildFileTreeString(file.children, indent + 1);
      }
    } else {
      result += `${prefix}📄 ${file.name}\n`;
    }
  }
  
  return result;
};

// Get related files based on imports/references
export const findRelatedFiles = (
  currentFile: FileNode,
  allFiles: FileNode[]
): FileNode[] => {
  const related: FileNode[] = [];
  const content = currentFile.content || '';
  
  // Extract import paths
  const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  
  let match;
  const importPaths: string[] = [];
  
  while ((match = importRegex.exec(content)) !== null) {
    importPaths.push(match[1]);
  }
  while ((match = requireRegex.exec(content)) !== null) {
    importPaths.push(match[1]);
  }
  
  // Find matching files
  const flatFiles = flattenFiles(allFiles);
  
  for (const importPath of importPaths) {
    const normalizedPath = importPath.replace(/^[@./]+/, '');
    const matchingFile = flatFiles.find(f => 
      f.path.includes(normalizedPath) || 
      f.name.replace(getExtension(f.name), '') === normalizedPath.split('/').pop()
    );
    
    if (matchingFile && !related.includes(matchingFile)) {
      related.push(matchingFile);
    }
  }
  
  return related;
};

// Flatten file tree
export const flattenFiles = (files: FileNode[]): FileNode[] => {
  const result: FileNode[] = [];
  
  for (const file of files) {
    if (file.type === 'file') {
      result.push(file);
    }
    if (file.children) {
      result.push(...flattenFiles(file.children));
    }
  }
  
  return result;
};

// Build comprehensive context for AI
export const buildProjectContext = (
  files: FileNode[],
  currentFile?: FileNode,
  selectedCode?: string
): ProjectContext => {
  const projectType = detectProjectType(files);
  const structure = buildFileTreeString(files);
  
  return {
    files,
    currentFile,
    selectedCode,
    projectType,
    structure
  };
};

// Format context for AI prompt
export const formatContextForAI = (context: ProjectContext): string => {
  let prompt = '';
  
  prompt += `## Project Type: ${context.projectType}\n\n`;
  prompt += `## Project Structure:\n\`\`\`\n${context.structure}\`\`\`\n\n`;
  
  if (context.currentFile) {
    prompt += `## Current File: ${context.currentFile.path}\n`;
    prompt += `\`\`\`${context.currentFile.language || ''}\n${context.currentFile.content || ''}\n\`\`\`\n\n`;
  }
  
  if (context.selectedCode) {
    prompt += `## Selected Code:\n\`\`\`\n${context.selectedCode}\n\`\`\`\n\n`;
  }
  
  return prompt;
};

// Get file content summary for large files
export const summarizeFileContent = (content: string, maxLines: number = 50): string => {
  const lines = content.split('\n');
  
  if (lines.length <= maxLines) {
    return content;
  }
  
  const halfLines = Math.floor(maxLines / 2);
  const start = lines.slice(0, halfLines).join('\n');
  const end = lines.slice(-halfLines).join('\n');
  
  return `${start}\n\n... (${lines.length - maxLines} lines omitted) ...\n\n${end}`;
};

// Build context for specific AI action
export const buildActionContext = (
  action: 'explain' | 'fix' | 'refactor' | 'test' | 'optimize' | 'document',
  code: string,
  language?: string,
  additionalContext?: string
): string => {
  const actionPrompts: Record<string, string> = {
    explain: 'Explain this code in detail:',
    fix: 'Fix any bugs or issues in this code:',
    refactor: 'Refactor this code for better quality:',
    test: 'Generate comprehensive tests for this code:',
    optimize: 'Optimize this code for performance:',
    document: 'Add documentation to this code:'
  };
  
  let prompt = actionPrompts[action] + '\n\n';
  
  if (language) {
    prompt += `Language: ${language}\n`;
  }
  
  prompt += `\`\`\`${language || ''}\n${code}\n\`\`\``;
  
  if (additionalContext) {
    prompt += `\n\nAdditional context:\n${additionalContext}`;
  }
  
  return prompt;
};

export default {
  detectProjectType,
  buildFileTreeString,
  findRelatedFiles,
  flattenFiles,
  buildProjectContext,
  formatContextForAI,
  summarizeFileContent,
  buildActionContext
};
