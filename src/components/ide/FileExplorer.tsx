import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  FolderPlus,
  MoreHorizontal,
  Trash2,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/stores/ideStore';
import type { FileNode } from '@/types/ide';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// File type to icon color mapping
const getFileIconColor = (language?: string): string => {
  switch (language) {
    case 'typescript':
    case 'typescriptreact':
      return 'text-neon-blue';
    case 'javascript':
    case 'javascriptreact':
      return 'text-yellow-400';
    case 'json':
      return 'text-yellow-500';
    case 'css':
    case 'scss':
    case 'less':
      return 'text-neon-pink';
    case 'html':
      return 'text-orange-400';
    case 'markdown':
      return 'text-muted-foreground';
    case 'python':
      return 'text-neon-green';
    default:
      return 'text-muted-foreground';
  }
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
}

function FileTreeItem({ node, depth }: FileTreeItemProps) {
  const { toggleFolder, openFile, deleteFile, createFile, createFolder } = useIDEStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else {
      openFile(node);
    }
  };

  const handleCreateFile = () => {
    setCreatingType('file');
    setNewItemName('');
  };

  const handleCreateFolder = () => {
    setCreatingType('folder');
    setNewItemName('');
  };

  const handleCreateSubmit = () => {
    if (newItemName.trim()) {
      if (creatingType === 'file') {
        createFile(node.id, newItemName.trim());
      } else if (creatingType === 'folder') {
        createFolder(node.id, newItemName.trim());
      }
    }
    setCreatingType(null);
    setNewItemName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateSubmit();
    } else if (e.key === 'Escape') {
      setCreatingType(null);
      setNewItemName('');
    }
  };

  const isFolder = node.type === 'folder';
  const isOpen = isFolder && node.isOpen;

  const content = (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1 py-0.5 px-2 cursor-pointer group',
        'hover:bg-sidebar-accent rounded-sm transition-colors',
        'text-sm text-sidebar-foreground'
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      {isFolder ? (
        <>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen className="w-4 h-4 text-neon-cyan shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-neon-cyan shrink-0" />
          )}
        </>
      ) : (
        <>
          <span className="w-4" />
          <File className={cn('w-4 h-4 shrink-0', getFileIconColor(node.language))} />
        </>
      )}
      <span className="truncate flex-1 ml-1">{node.name}</span>
      
      {isFolder && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-background rounded transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCreateFile(); }}>
              <Plus className="w-4 h-4 mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCreateFolder(); }}>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); deleteFile(node.id); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {content}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {isFolder && (
          <>
            <ContextMenuItem onClick={handleCreateFile}>
              <Plus className="w-4 h-4 mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCreateFolder}>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={() => setIsRenaming(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => deleteFile(node.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
      
      {/* Children */}
      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* New item input */}
            {creatingType && (
              <div 
                className="flex items-center gap-1 py-0.5 px-2"
                style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
              >
                <span className="w-4" />
                {creatingType === 'folder' ? (
                  <Folder className="w-4 h-4 text-neon-cyan shrink-0" />
                ) : (
                  <File className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <input
                  autoFocus
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onBlur={handleCreateSubmit}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-input border border-primary rounded px-1 py-0.5 text-sm outline-none"
                  placeholder={creatingType === 'folder' ? 'folder name' : 'file name'}
                />
              </div>
            )}
            
            {node.children.map((child) => (
              <FileTreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </ContextMenu>
  );
}

export function FileExplorer() {
  const { files } = useIDEStore();

  return (
    <div className="h-full overflow-auto py-2">
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </h3>
      </div>
      <div className="space-y-0.5">
        {files.map((node) => (
          <FileTreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
