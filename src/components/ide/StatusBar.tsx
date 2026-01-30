import { GitBranch, AlertCircle, CheckCircle2, Bell } from 'lucide-react';
import { useIDEStore } from '@/stores/ideStore';
import { cn } from '@/lib/utils';

export function StatusBar() {
  const { statusBarItems } = useIDEStore();
  
  const leftItems = statusBarItems.filter(item => item.position === 'left');
  const rightItems = statusBarItems.filter(item => item.position === 'right');

  return (
    <div className="h-6 bg-status flex items-center justify-between px-2 text-status-foreground text-xs">
      <div className="flex items-center gap-3">
        {leftItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors"
          >
            {item.id === 'branch' && <GitBranch className="w-3.5 h-3.5" />}
            {item.id === 'problems' && <AlertCircle className="w-3.5 h-3.5" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        {rightItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors"
          >
            <span>{item.label}</span>
          </button>
        ))}
        <button className="flex items-center hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors">
          <Bell className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
