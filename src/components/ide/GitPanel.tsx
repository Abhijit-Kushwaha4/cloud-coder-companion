import { GitBranch, GitCommit, Plus, Minus, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GitPanel() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Source Control
        </h3>
      </div>
      
      <div className="px-3 space-y-4">
        {/* Current branch */}
        <div className="flex items-center gap-2 text-sm">
          <GitBranch className="w-4 h-4 text-neon-cyan" />
          <span>main</span>
          <RefreshCw className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground ml-auto" />
        </div>
        
        {/* Commit message */}
        <div className="space-y-2">
          <Input 
            placeholder="Message (Ctrl+Enter to commit)" 
            className="h-8 text-sm"
          />
          <Button size="sm" className="w-full h-8">
            <Check className="w-4 h-4 mr-1" />
            Commit
          </Button>
        </div>
        
        {/* Changes section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">CHANGES</span>
            <span className="text-xs text-muted-foreground">0</span>
          </div>
          <div className="text-sm text-muted-foreground text-center py-4">
            No changes detected
          </div>
        </div>
        
        {/* Recent commits */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">COMMITS</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-start gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
              <GitCommit className="w-4 h-4 text-neon-purple mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">Initial commit</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
