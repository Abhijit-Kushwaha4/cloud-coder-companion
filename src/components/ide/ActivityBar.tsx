import { 
  Files, 
  Search, 
  GitBranch, 
  Blocks, 
  MessageSquare,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/stores/ideStore';
import type { SidebarPanelId } from '@/types/ide';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const panels: { id: SidebarPanelId; icon: React.ElementType; label: string }[] = [
  { id: 'explorer', icon: Files, label: 'Explorer (Ctrl+Shift+E)' },
  { id: 'search', icon: Search, label: 'Search (Ctrl+Shift+F)' },
  { id: 'git', icon: GitBranch, label: 'Source Control (Ctrl+Shift+G)' },
  { id: 'extensions', icon: Blocks, label: 'Extensions (Ctrl+Shift+X)' },
  { id: 'ai-chat', icon: MessageSquare, label: 'AI Chat (Ctrl+Shift+I)' },
];

export function ActivityBar() {
  const { activeSidebarPanel, setActiveSidebarPanel, sidebarVisible, toggleSidebar } = useIDEStore();

  const handlePanelClick = (panelId: SidebarPanelId) => {
    if (activeSidebarPanel === panelId && sidebarVisible) {
      toggleSidebar();
    } else {
      if (!sidebarVisible) {
        toggleSidebar();
      }
      setActiveSidebarPanel(panelId);
    }
  };

  return (
    <div className="flex flex-col h-full w-12 bg-activity border-r border-border">
      <div className="flex flex-col flex-1 py-1">
        {panels.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handlePanelClick(id)}
                className={cn(
                  'relative flex items-center justify-center w-12 h-12 transition-smooth',
                  'hover:text-foreground',
                  activeSidebarPanel === id && sidebarVisible
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {activeSidebarPanel === id && sidebarVisible && (
                  <motion.div
                    layoutId="activity-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <div className="py-1 border-t border-border">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Settings (Ctrl+,)
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
