import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Trash2, 
  Loader2, 
  Bot, 
  User, 
  Code, 
  Bug, 
  Wand2, 
  FileText,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  TestTube,
  FileSearch,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { useIDEStore } from '@/stores/ideStore';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export function AISidebarPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    loading, 
    error, 
    chat, 
    explainCode,
    fixCode,
    refactorCode,
    generateTests,
    summarizeFile,
    reset 
  } = useDeepSeekAI();
  
  const { openFiles, editorGroups, activeGroupId } = useIDEStore();

  // Get current file content
  const getCurrentFileContent = (): string | null => {
    const activeGroup = editorGroups.find(g => g.id === activeGroupId);
    if (!activeGroup?.activeTabId) return null;
    
    const activeTab = activeGroup.tabs.find(t => t.id === activeGroup.activeTabId);
    if (!activeTab) return null;
    
    const file = openFiles.find(f => f.id === activeTab.id);
    return file?.content || null;
  };

  const getCurrentFileName = (): string | null => {
    const activeGroup = editorGroups.find(g => g.id === activeGroupId);
    if (!activeGroup?.activeTabId) return null;
    
    const activeTab = activeGroup.tabs.find(t => t.id === activeGroup.activeTabId);
    return activeTab?.fileName || null;
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    
    const result = await chat(userMessage);
    
    if (result.success && result.data) {
      addMessage('assistant', result.data);
    } else {
      addMessage('assistant', `Error: ${result.error || 'Failed to get response'}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = async (actionType: string) => {
    const content = getCurrentFileContent();
    const fileName = getCurrentFileName();
    
    if (!content) {
      addMessage('assistant', 'Please open a file first to use this action.');
      return;
    }

    addMessage('user', `[${actionType}] ${fileName || 'current file'}`);
    
    let result;
    switch (actionType) {
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
      case 'summarize':
        result = await summarizeFile(content, fileName || undefined);
        break;
      default:
        return;
    }
    
    if (result.success && result.data) {
      addMessage('assistant', result.data);
    } else {
      addMessage('assistant', `Error: ${result.error || 'Action failed'}`);
    }
  };

  const clearChat = () => {
    setMessages([]);
    reset();
  };

  const quickActions: QuickAction[] = [
    {
      id: 'explain',
      label: 'Explain',
      icon: <Lightbulb className="w-3.5 h-3.5" />,
      action: () => handleQuickAction('explain')
    },
    {
      id: 'fix',
      label: 'Fix Bugs',
      icon: <Bug className="w-3.5 h-3.5" />,
      action: () => handleQuickAction('fix')
    },
    {
      id: 'refactor',
      label: 'Refactor',
      icon: <Wand2 className="w-3.5 h-3.5" />,
      action: () => handleQuickAction('refactor')
    },
    {
      id: 'tests',
      label: 'Tests',
      icon: <TestTube className="w-3.5 h-3.5" />,
      action: () => handleQuickAction('tests')
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <FileSearch className="w-3.5 h-3.5" />,
      action: () => handleQuickAction('summarize')
    }
  ];

  // Format message content with code blocks
  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        if (match) {
          const [, language, code] = match;
          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden border border-border">
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground">
                <span>{language || 'code'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(code.trim(), `code-${index}`)}
                >
                  {copiedId === `code-${index}` ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
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
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">DeepSeek V3</h3>
            <p className="text-[10px] text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="h-7 w-7 p-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-border">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={action.action}
            disabled={loading}
            className="h-7 px-2 text-xs gap-1"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full py-8 text-center"
            >
              <div className="p-4 rounded-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 mb-4">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ask me anything about your code
              </p>
              <p className="text-xs text-muted-foreground/60">
                Or use quick actions above
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {formatContent(message.content)}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <div className="px-3 py-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code..."
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-auto px-3 bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
