import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Bug,
  Wand2,
  TestTube,
  FileText,
  Zap,
  Languages,
  Copy,
  Check,
  Loader2,
  X
} from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { cn } from '@/lib/utils';

interface AIContextMenuProps {
  children: React.ReactNode;
  selectedCode?: string;
  language?: string;
  onApplyCode?: (code: string) => void;
}

interface ConversionLanguage {
  id: string;
  label: string;
}

const conversionLanguages: ConversionLanguage[] = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'java', label: 'Java' },
  { id: 'c++', label: 'C++' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'php', label: 'PHP' },
];

export function AIContextMenu({ 
  children, 
  selectedCode = '', 
  language = 'plaintext',
  onApplyCode 
}: AIContextMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const {
    loading,
    error,
    explainCode,
    fixCode,
    refactorCode,
    generateTests,
    optimizeCode,
    documentCode,
    improveReadability,
    convertCode
  } = useDeepSeekAI();

  const openDialog = (title: string) => {
    setDialogTitle(title);
    setResult(null);
    setDialogOpen(true);
  };

  const handleAction = async (action: string, targetLang?: string) => {
    if (!selectedCode.trim()) return;

    let actionTitle = '';
    let actionResult;

    switch (action) {
      case 'explain':
        actionTitle = 'Code Explanation';
        openDialog(actionTitle);
        actionResult = await explainCode(selectedCode, language);
        break;
      case 'fix':
        actionTitle = 'Bug Fix';
        openDialog(actionTitle);
        actionResult = await fixCode(selectedCode);
        break;
      case 'refactor':
        actionTitle = 'Refactored Code';
        openDialog(actionTitle);
        actionResult = await refactorCode(selectedCode);
        break;
      case 'tests':
        actionTitle = 'Generated Tests';
        openDialog(actionTitle);
        actionResult = await generateTests(selectedCode);
        break;
      case 'optimize':
        actionTitle = 'Optimized Code';
        openDialog(actionTitle);
        actionResult = await optimizeCode(selectedCode);
        break;
      case 'document':
        actionTitle = 'Documented Code';
        openDialog(actionTitle);
        actionResult = await documentCode(selectedCode);
        break;
      case 'readability':
        actionTitle = 'Improved Readability';
        openDialog(actionTitle);
        actionResult = await improveReadability(selectedCode);
        break;
      case 'convert':
        if (targetLang) {
          actionTitle = `Converted to ${targetLang}`;
          openDialog(actionTitle);
          actionResult = await convertCode(selectedCode, language, targetLang);
        }
        break;
    }

    if (actionResult?.success && actionResult.data) {
      setResult(actionResult.data);
    } else if (actionResult?.error) {
      setResult(`Error: ${actionResult.error}`);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (result && onApplyCode) {
      // Extract code from markdown code blocks if present
      const codeMatch = result.match(/```[\w]*\n?([\s\S]*?)```/);
      const codeToApply = codeMatch ? codeMatch[1].trim() : result;
      onApplyCode(codeToApply);
      setDialogOpen(false);
    }
  };

  const formatResult = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        if (match) {
          const [, lang, code] = match;
          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden border border-border">
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground">
                <span>{lang || 'code'}</span>
              </div>
              <pre className="p-3 overflow-x-auto text-xs bg-editor">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem 
            onClick={() => handleAction('explain')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Explain Selection</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={() => handleAction('fix')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <Bug className="w-4 h-4" />
            <span>Debug / Fix Errors</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={() => handleAction('refactor')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Refactor Code</span>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem 
            onClick={() => handleAction('readability')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Improve Readability</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={() => handleAction('optimize')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Optimize Performance</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={() => handleAction('document')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Add Documentation</span>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem 
            onClick={() => handleAction('tests')}
            disabled={!selectedCode.trim()}
            className="gap-2"
          >
            <TestTube className="w-4 h-4" />
            <span>Generate Tests</span>
          </ContextMenuItem>
          
          <ContextMenuSub>
            <ContextMenuSubTrigger className="gap-2" disabled={!selectedCode.trim()}>
              <Languages className="w-4 h-4" />
              <span>Convert To...</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {conversionLanguages.map((lang) => (
                <ContextMenuItem
                  key={lang.id}
                  onClick={() => handleAction('convert', lang.id)}
                  disabled={lang.id.toLowerCase() === language.toLowerCase()}
                >
                  {lang.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

      {/* Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-neon-cyan" />
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>
              AI-generated result based on your selection
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
                  <p className="text-sm text-muted-foreground">Processing with DeepSeek V3...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : result ? (
              <div className="text-sm">
                {formatResult(result)}
              </div>
            ) : null}
          </ScrollArea>
          
          {result && !loading && !error && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
              {onApplyCode && (
                <Button
                  size="sm"
                  onClick={handleApply}
                  className="gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple"
                >
                  Apply Changes
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
