import { useState } from 'react';
import { Search, Replace, CaseSensitive, Regex, WholeWord } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  return (
    <div className="h-full overflow-auto">
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search
        </h3>
      </div>
      
      <div className="px-3 space-y-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowReplace(!showReplace)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Replace className={cn('w-4 h-4', showReplace && 'text-primary')} />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1 pl-6">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={cn(
              'p-1 rounded transition-colors',
              caseSensitive ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'
            )}
            title="Match Case"
          >
            <CaseSensitive className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className={cn(
              'p-1 rounded transition-colors',
              wholeWord ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'
            )}
            title="Match Whole Word"
          >
            <WholeWord className="w-4 h-4" />
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={cn(
              'p-1 rounded transition-colors',
              useRegex ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'
            )}
            title="Use Regular Expression"
          >
            <Regex className="w-4 h-4" />
          </button>
        </div>
        
        {showReplace && (
          <div className="pl-6">
            <Input
              placeholder="Replace"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        )}
        
        {searchQuery && (
          <div className="pt-4">
            <p className="text-xs text-muted-foreground px-1">
              No results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
