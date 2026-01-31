// Enhanced Command Palette with AI Commands
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  File,
  Settings,
  Search,
  Terminal,
  GitBranch,
  Palette,
  Sun,
  Moon,
  Code,
  FolderPlus,
  Save,
  Keyboard,
  Sparkles,
  Wand2,
  Bug,
  TestTube,
  FileText,
  Zap,
  Bot,
  RefreshCw,
  Search as SearchIcon,
  Languages,
  BookOpen
} from 'lucide-react';
import { useIDEStore } from '@/stores/ideStore';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { toast } from 'sonner';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'file' | 'edit' | 'view' | 'ai' | 'terminal' | 'git' | 'settings';
}

export function CommandPalette() {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    files,
    openFile,
    settings,
    updateSettings,
    editorGroups,
    activeGroupId,
    openFiles
  } = useIDEStore();

  const {
    explainCode,
    fixCode,
    refactorCode,
    generateTests,
    optimizeCode,
    documentCode,
    summarizeFile,
    findDeadCode,
    improveReadability,
    scanProject
  } = useDeepSeekAI();

  const getCurrentFileContent = (): string | null => {
    const activeGroup = editorGroups.find(g => g.id === activeGroupId);
    if (!activeGroup?.activeTabId) return null;
    
    const activeTab = activeGroup.tabs.find(t => t.id === activeGroup.activeTabId);
    if (!activeTab) return null;
    
    const file = openFiles.find(f => f.id === activeTab.id);
    return file?.content || null;
  };

  const handleAIAction = async (action: string) => {
    const content = getCurrentFileContent();
    
    if (!content) {
      toast.error('Please open a file first');
      setCommandPaletteOpen(false);
      return;
    }

    setCommandPaletteOpen(false);
    toast.loading(`Running AI: ${action}...`);

    let result;
    switch (action) {
      case 'explain':
        result = await explainCode(content);
        break;
      case 'fix':
        result = await fixCode(content);
        break;
      case 'refactor':
        result = await refactorCode(content);
        break;
      case 'tests':
        result = await generateTests(content);
        break;
      case 'optimize':
        result = await optimizeCode(content);
        break;
      case 'document':
        result = await documentCode(content);
        break;
      case 'summarize':
        result = await summarizeFile(content);
        break;
      case 'deadcode':
        result = await findDeadCode(content);
        break;
      case 'readability':
        result = await improveReadability(content);
        break;
    }

    toast.dismiss();
    
    if (result?.success) {
      toast.success(`AI: ${action} completed`, {
        description: 'Check the AI panel for results'
      });
    } else {
      toast.error(`AI: ${action} failed`, {
        description: result?.error || 'Unknown error'
      });
    }
  };

  const commands: CommandItem[] = [
    // File Commands
    {
      id: 'new-file',
      label: 'New File',
      shortcut: '⌘N',
      icon: <File className="w-4 h-4" />,
      action: () => {
        toast.info('Create new file from explorer');
        setCommandPaletteOpen(false);
      },
      category: 'file'
    },
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: <FolderPlus className="w-4 h-4" />,
      action: () => {
        toast.info('Create new folder from explorer');
        setCommandPaletteOpen(false);
      },
      category: 'file'
    },
    {
      id: 'save-file',
      label: 'Save File',
      shortcut: '⌘S',
      icon: <Save className="w-4 h-4" />,
      action: () => {
        toast.success('File saved');
        setCommandPaletteOpen(false);
      },
      category: 'file'
    },

    // AI Commands
    {
      id: 'ai-explain',
      label: 'AI: Explain Code',
      icon: <BookOpen className="w-4 h-4" />,
      action: () => handleAIAction('explain'),
      category: 'ai'
    },
    {
      id: 'ai-fix',
      label: 'AI: Fix Bugs',
      icon: <Bug className="w-4 h-4" />,
      action: () => handleAIAction('fix'),
      category: 'ai'
    },
    {
      id: 'ai-refactor',
      label: 'AI: Refactor Code',
      icon: <Wand2 className="w-4 h-4" />,
      action: () => handleAIAction('refactor'),
      category: 'ai'
    },
    {
      id: 'ai-tests',
      label: 'AI: Generate Tests',
      icon: <TestTube className="w-4 h-4" />,
      action: () => handleAIAction('tests'),
      category: 'ai'
    },
    {
      id: 'ai-optimize',
      label: 'AI: Optimize Performance',
      icon: <Zap className="w-4 h-4" />,
      action: () => handleAIAction('optimize'),
      category: 'ai'
    },
    {
      id: 'ai-document',
      label: 'AI: Add Documentation',
      icon: <FileText className="w-4 h-4" />,
      action: () => handleAIAction('document'),
      category: 'ai'
    },
    {
      id: 'ai-summarize',
      label: 'AI: Summarize File',
      icon: <FileText className="w-4 h-4" />,
      action: () => handleAIAction('summarize'),
      category: 'ai'
    },
    {
      id: 'ai-deadcode',
      label: 'AI: Find Dead Code',
      icon: <SearchIcon className="w-4 h-4" />,
      action: () => handleAIAction('deadcode'),
      category: 'ai'
    },
    {
      id: 'ai-readability',
      label: 'AI: Improve Readability',
      icon: <RefreshCw className="w-4 h-4" />,
      action: () => handleAIAction('readability'),
      category: 'ai'
    },

    // View Commands
    {
      id: 'toggle-theme',
      label: settings.theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
        setCommandPaletteOpen(false);
      },
      category: 'view'
    },
    {
      id: 'toggle-minimap',
      label: settings.minimap ? 'Hide Minimap' : 'Show Minimap',
      icon: <Code className="w-4 h-4" />,
      action: () => {
        updateSettings({ minimap: !settings.minimap });
        setCommandPaletteOpen(false);
      },
      category: 'view'
    },
    {
      id: 'toggle-line-numbers',
      label: settings.lineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers',
      icon: <Code className="w-4 h-4" />,
      action: () => {
        updateSettings({ lineNumbers: !settings.lineNumbers });
        setCommandPaletteOpen(false);
      },
      category: 'view'
    },

    // Terminal Commands
    {
      id: 'new-terminal',
      label: 'New Terminal',
      shortcut: '⌘`',
      icon: <Terminal className="w-4 h-4" />,
      action: () => {
        toast.info('Terminal feature coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'terminal'
    },

    // Git Commands
    {
      id: 'git-commit',
      label: 'Git: Commit',
      icon: <GitBranch className="w-4 h-4" />,
      action: () => {
        toast.info('Git feature coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'git'
    },
    {
      id: 'git-push',
      label: 'Git: Push',
      icon: <GitBranch className="w-4 h-4" />,
      action: () => {
        toast.info('Git feature coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'git'
    },
    {
      id: 'git-pull',
      label: 'Git: Pull',
      icon: <GitBranch className="w-4 h-4" />,
      action: () => {
        toast.info('Git feature coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'git'
    },

    // Settings
    {
      id: 'open-settings',
      label: 'Open Settings',
      shortcut: '⌘,',
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        toast.info('Settings panel coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'settings'
    },
    {
      id: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      shortcut: '⌘K ⌘S',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => {
        toast.info('Keyboard shortcuts reference coming soon');
        setCommandPaletteOpen(false);
      },
      category: 'settings'
    },
  ];

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  const groupedCommands = {
    ai: commands.filter(c => c.category === 'ai'),
    file: commands.filter(c => c.category === 'file'),
    view: commands.filter(c => c.category === 'view'),
    terminal: commands.filter(c => c.category === 'terminal'),
    git: commands.filter(c => c.category === 'git'),
    settings: commands.filter(c => c.category === 'settings'),
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <Command className="rounded-lg border shadow-2xl">
        <CommandInput placeholder="Type a command or search..." className="h-12" />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* AI Commands - Highlighted */}
          <CommandGroup heading={
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              AI (DeepSeek V3)
            </span>
          }>
            {groupedCommands.ai.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                <div className="p-1 rounded bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10">
                  {command.icon}
                </div>
                <span>{command.label}</span>
                {command.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {command.shortcut}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="File">
            {groupedCommands.file.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                {command.icon}
                <span>{command.label}</span>
                {command.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {command.shortcut}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="View">
            {groupedCommands.view.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                {command.icon}
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Terminal">
            {groupedCommands.terminal.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                {command.icon}
                <span>{command.label}</span>
                {command.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {command.shortcut}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Git">
            {groupedCommands.git.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                {command.icon}
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            {groupedCommands.settings.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={command.action}
                className="gap-3"
              >
                {command.icon}
                <span>{command.label}</span>
                {command.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {command.shortcut}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
