import { useEffect, useState, useMemo } from 'react';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command';
import { useIDEStore } from '@/stores/ideStore';
import { 
  File, 
  Settings, 
  Moon, 
  Sun, 
  FolderOpen, 
  Save, 
  Search,
  Terminal,
  GitBranch,
  Palette,
  Keyboard
} from 'lucide-react';
import type { Command } from '@/types/ide';

export function CommandPalette() {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    files, 
    openFile,
    settings,
    updateSettings 
  } = useIDEStore();
  
  const [search, setSearch] = useState('');

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        setSearch('>'); // Quick file search mode
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  // Get all files flattened
  const allFiles = useMemo(() => {
    const flattenFiles = (nodes: typeof files): typeof files => {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file') {
          acc.push(node);
        }
        if (node.children) {
          acc.push(...flattenFiles(node.children));
        }
        return acc;
      }, [] as typeof files);
    };
    return flattenFiles(files);
  }, [files]);

  const commands: Command[] = [
    {
      id: 'toggle-theme',
      label: settings.theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      shortcut: undefined,
      category: 'Preferences',
      action: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }),
    },
    {
      id: 'toggle-minimap',
      label: settings.minimap ? 'Hide Minimap' : 'Show Minimap',
      shortcut: undefined,
      category: 'View',
      action: () => updateSettings({ minimap: !settings.minimap }),
    },
    {
      id: 'toggle-word-wrap',
      label: settings.wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap',
      shortcut: 'Alt+Z',
      category: 'View',
      action: () => updateSettings({ wordWrap: !settings.wordWrap }),
    },
    {
      id: 'increase-font',
      label: 'Increase Font Size',
      shortcut: 'Ctrl++',
      category: 'View',
      action: () => updateSettings({ fontSize: settings.fontSize + 1 }),
    },
    {
      id: 'decrease-font',
      label: 'Decrease Font Size',
      shortcut: 'Ctrl+-',
      category: 'View',
      action: () => updateSettings({ fontSize: settings.fontSize - 1 }),
    },
  ];

  const handleSelect = (command: Command) => {
    command.action();
    setCommandPaletteOpen(false);
    setSearch('');
  };

  const handleFileSelect = (file: typeof allFiles[0]) => {
    openFile(file);
    setCommandPaletteOpen(false);
    setSearch('');
  };

  const isFileSearch = !search.startsWith('>');

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {isFileSearch && search && (
          <CommandGroup heading="Files">
            {allFiles
              .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
              .slice(0, 10)
              .map((file) => (
                <CommandItem
                  key={file.id}
                  onSelect={() => handleFileSelect(file)}
                  className="flex items-center gap-2"
                >
                  <File className="w-4 h-4 text-muted-foreground" />
                  <span>{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto truncate max-w-[200px]">
                    {file.path}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
        
        {(search.startsWith('>') || !search) && (
          <>
            <CommandGroup heading="Recently Used">
              <CommandItem onSelect={() => handleSelect(commands[0])}>
                {settings.theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{commands[0].label}</span>
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="View">
              {commands.filter(c => c.category === 'View').map((cmd) => (
                <CommandItem key={cmd.id} onSelect={() => handleSelect(cmd)}>
                  <span>{cmd.label}</span>
                  {cmd.shortcut && (
                    <CommandShortcut>{cmd.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="Preferences">
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Open Settings</span>
                <CommandShortcut>Ctrl+,</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Keyboard Shortcuts</span>
                <CommandShortcut>Ctrl+K Ctrl+S</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Palette className="mr-2 h-4 w-4" />
                <span>Color Theme</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
