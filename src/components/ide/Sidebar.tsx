import { motion } from 'framer-motion';
import { useIDEStore } from '@/stores/ideStore';
import { FileExplorer } from './FileExplorer';
import { SearchPanel } from './SearchPanel';
import { GitPanel } from './GitPanel';
import { ExtensionsPanel } from './ExtensionsPanel';
import { AISidebarPanel } from './AISidebarPanel';

export function Sidebar() {
  const { activeSidebarPanel, sidebarWidth, sidebarVisible } = useIDEStore();

  if (!sidebarVisible) {
    return null;
  }

  const renderPanel = () => {
    switch (activeSidebarPanel) {
      case 'explorer':
        return <FileExplorer />;
      case 'search':
        return <SearchPanel />;
      case 'git':
        return <GitPanel />;
      case 'extensions':
        return <ExtensionsPanel />;
      case 'ai-chat':
        return <AISidebarPanel />;
      default:
        return <FileExplorer />;
    }
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: sidebarWidth, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full bg-sidebar border-r border-border overflow-hidden flex flex-col"
      style={{ width: sidebarWidth }}
    >
      {renderPanel()}
    </motion.div>
  );
}
