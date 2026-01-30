import { Search, Download, Check, Sparkles, Palette, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  installed: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const extensions: Extension[] = [
  {
    id: 'prettier',
    name: 'Prettier',
    description: 'Code formatter using prettier',
    author: 'Prettier',
    installed: true,
    icon: Sparkles,
    iconColor: 'text-neon-pink',
  },
  {
    id: 'eslint',
    name: 'ESLint',
    description: 'Integrates ESLint into VS Code',
    author: 'Microsoft',
    installed: true,
    icon: Code2,
    iconColor: 'text-neon-purple',
  },
  {
    id: 'themes',
    name: 'Synthwave Themes',
    description: 'Neon retro themes pack',
    author: 'VS Code++',
    installed: false,
    icon: Palette,
    iconColor: 'text-neon-cyan',
  },
];

export function ExtensionsPanel() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Extensions
        </h3>
      </div>
      
      <div className="px-3 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search extensions..."
            className="pl-8 h-8 text-sm"
          />
        </div>
        
        {/* Installed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">INSTALLED</span>
            <span className="text-xs text-muted-foreground">
              {extensions.filter(e => e.installed).length}
            </span>
          </div>
          <div className="space-y-2">
            {extensions.filter(e => e.installed).map((ext) => (
              <ExtensionItem key={ext.id} extension={ext} />
            ))}
          </div>
        </div>
        
        {/* Recommended */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">RECOMMENDED</span>
          </div>
          <div className="space-y-2">
            {extensions.filter(e => !e.installed).map((ext) => (
              <ExtensionItem key={ext.id} extension={ext} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtensionItem({ extension }: { extension: Extension }) {
  const Icon = extension.icon;
  
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors">
      <div className={`p-1.5 rounded-md bg-muted ${extension.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{extension.name}</span>
          {extension.installed && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-4">
              <Check className="w-3 h-3 mr-0.5" />
              Installed
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{extension.description}</p>
        <p className="text-xs text-muted-foreground">{extension.author}</p>
      </div>
      {!extension.installed && (
        <Button 
          size="sm" 
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 h-7 px-2"
        >
          <Download className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
