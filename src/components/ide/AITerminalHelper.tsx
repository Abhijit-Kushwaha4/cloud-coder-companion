import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  Bug,
  Wand2,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { cn } from '@/lib/utils';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'ai-suggestion';
  content: string;
  timestamp: Date;
}

interface AITerminalHelperProps {
  terminalOutput?: string[];
  onExecuteCommand?: (command: string) => void;
  className?: string;
}

export function AITerminalHelper({ 
  terminalOutput = [], 
  onExecuteCommand,
  className 
}: AITerminalHelperProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { 
    loading, 
    error,
    fixTerminalError,
    suggestCommand,
    query
  } = useDeepSeekAI();

  // Detect if there's an error in the terminal output
  const hasError = terminalOutput.some(line => 
    line.toLowerCase().includes('error') ||
    line.toLowerCase().includes('failed') ||
    line.toLowerCase().includes('exception') ||
    line.toLowerCase().includes('traceback')
  );

  const handleFixError = async () => {
    if (terminalOutput.length === 0) return;
    
    const errorOutput = terminalOutput.join('\n');
    const result = await fixTerminalError(errorOutput);
    
    if (result.success && result.data) {
      setAiResponse(result.data);
      setIsExpanded(true);
    }
  };

  const handleSuggestCommand = async () => {
    if (!input.trim()) return;
    
    const result = await suggestCommand(input.trim());
    setInput('');
    
    if (result.success && result.data) {
      setAiResponse(result.data);
      setIsExpanded(true);
    }
  };

  const handleAskQuestion = async () => {
    if (!input.trim()) return;
    
    const context = terminalOutput.length > 0 
      ? `Terminal context:\n${terminalOutput.slice(-20).join('\n')}\n\nQuestion: ${input.trim()}`
      : input.trim();
    
    const result = await query(context);
    setInput('');
    
    if (result.success && result.data) {
      setAiResponse(result.data);
      setIsExpanded(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractCommand = (text: string): string | null => {
    // Try to extract command from markdown code blocks
    const codeMatch = text.match(/```(?:bash|sh|shell)?\n?([\s\S]*?)```/);
    if (codeMatch) return codeMatch[1].trim();
    
    // Try to extract inline code
    const inlineMatch = text.match(/`([^`]+)`/);
    if (inlineMatch) return inlineMatch[1].trim();
    
    return null;
  };

  const handleApplyCommand = () => {
    if (aiResponse && onExecuteCommand) {
      const command = extractCommand(aiResponse);
      if (command) {
        onExecuteCommand(command);
      }
    }
  };

  const formatResponse = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        if (match) {
          const [, lang, code] = match;
          return (
            <div key={index} className="my-2 rounded overflow-hidden border border-border">
              <div className="flex items-center justify-between px-2 py-1 bg-muted/50 text-[10px] text-muted-foreground">
                <span>{lang || 'command'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => copyToClipboard(code.trim())}
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <pre className="p-2 overflow-x-auto text-xs bg-black/50 text-green-400 font-mono">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      return <span key={index} className="whitespace-pre-wrap text-xs">{part}</span>;
    });
  };

  return (
    <div className={cn("border-t border-border bg-sidebar", className)}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
          </div>
          <span className="text-xs font-medium">AI Terminal Helper</span>
        </div>
        
        <div className="flex items-center gap-1">
          {hasError && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFixError}
              disabled={loading}
              className="h-6 px-2 text-xs gap-1 text-orange-400 hover:text-orange-300"
            >
              <Bug className="w-3 h-3" />
              Fix Error
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* AI Response */}
            {(loading || aiResponse || error) && (
              <div className="p-3 border-b border-border">
                {loading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing with DeepSeek V3...
                  </div>
                ) : error ? (
                  <div className="p-2 rounded bg-destructive/10 text-xs text-destructive">
                    {error}
                  </div>
                ) : aiResponse ? (
                  <ScrollArea className="max-h-[200px]">
                    <div className="text-sm text-foreground">
                      {formatResponse(aiResponse)}
                    </div>
                    
                    {extractCommand(aiResponse) && onExecuteCommand && (
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={handleApplyCommand}
                          className="h-7 text-xs gap-1 bg-gradient-to-r from-neon-cyan to-neon-purple"
                        >
                          <Terminal className="w-3 h-3" />
                          Run Command
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                ) : null}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('How do I install dependencies?');
                  handleAskQuestion();
                }}
                disabled={loading}
                className="h-6 px-2 text-[10px]"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Install Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('How do I run tests?');
                  handleAskQuestion();
                }}
                disabled={loading}
                className="h-6 px-2 text-[10px]"
              >
                Run Tests
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('How do I deploy this project?');
                  handleAskQuestion();
                }}
                disabled={loading}
                className="h-6 px-2 text-[10px]"
              >
                Deploy Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('Git commands cheatsheet');
                  handleAskQuestion();
                }}
                disabled={loading}
                className="h-6 px-2 text-[10px]"
              >
                Git Help
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex gap-2 p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about commands, errors, or terminal usage..."
                className="h-8 text-xs"
                disabled={loading}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={!input.trim() || loading}
                size="sm"
                className="h-8 px-3 bg-gradient-to-r from-neon-cyan to-neon-purple"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
