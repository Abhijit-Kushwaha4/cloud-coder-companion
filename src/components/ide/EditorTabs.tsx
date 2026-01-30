import { X, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/stores/ideStore';
import type { EditorTab } from '@/types/ide';

// File type to icon color mapping
const getTabIconColor = (language: string): string => {
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
      return 'text-neon-pink';
    case 'html':
      return 'text-orange-400';
    case 'markdown':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

interface TabItemProps {
  tab: EditorTab;
  isActive: boolean;
  onClose: (e: React.MouseEvent) => void;
  onClick: () => void;
}

function TabItem({ tab, isActive, onClose, onClick }: TabItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 cursor-pointer group border-r border-tab-border',
        'hover:bg-tab-active transition-colors min-w-0',
        isActive ? 'bg-tab-active' : 'bg-tab-inactive'
      )}
    >
      {/* File icon dot */}
      <div className={cn('w-2 h-2 rounded-full shrink-0', getTabIconColor(tab.language).replace('text-', 'bg-'))} />
      
      {/* File name */}
      <span className="text-sm truncate max-w-[120px]">{tab.fileName}</span>
      
      {/* Dirty indicator or close button */}
      <button
        onClick={onClose}
        className={cn(
          'p-0.5 rounded hover:bg-muted transition-colors shrink-0',
          'opacity-0 group-hover:opacity-100',
          tab.isDirty && 'opacity-100'
        )}
      >
        {tab.isDirty ? (
          <Circle className="w-3 h-3 fill-current" />
        ) : (
          <X className="w-3 h-3" />
        )}
      </button>
    </motion.div>
  );
}

export function EditorTabs() {
  const { editorGroups, activeGroupId, closeTab, setActiveTab } = useIDEStore();
  
  const activeGroup = editorGroups.find(g => g.id === activeGroupId);
  if (!activeGroup || activeGroup.tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-tab-inactive border-b border-border overflow-x-auto">
      {activeGroup.tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeGroup.activeTabId}
          onClick={() => setActiveTab(tab.id)}
          onClose={(e) => {
            e.stopPropagation();
            closeTab(tab.id);
          }}
        />
      ))}
    </div>
  );
}
