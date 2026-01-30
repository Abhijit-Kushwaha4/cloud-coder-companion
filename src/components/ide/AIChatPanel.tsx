import { useState } from 'react';
import { Send, Sparkles, Code, FileQuestion, Wand2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: FileQuestion, label: 'Explain', prompt: 'Explain this code' },
  { icon: Wand2, label: 'Refactor', prompt: 'Refactor this code' },
  { icon: Code, label: 'Tests', prompt: 'Write tests for this code' },
];

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding assistant. I can help you explain code, refactor, write tests, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Integrate with Lovable AI Gateway
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm ready to help! This AI chat will be connected to Lovable AI Gateway for intelligent code assistance. For now, this is a placeholder response.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-neon-purple" />
          AI Chat
        </h3>
      </div>
      
      {/* Quick actions */}
      <div className="px-3 py-2 flex gap-1 border-b border-border">
        {quickActions.map(({ icon: Icon, label, prompt }) => (
          <Button
            key={label}
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInput(prompt)}
          >
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-full shrink-0',
                  message.role === 'assistant' ? 'bg-neon-purple/20' : 'bg-primary/20'
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="w-4 h-4 text-neon-purple" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-primary" />
                )}
              </div>
              <div
                className={cn(
                  'rounded-lg px-3 py-2 text-sm max-w-[85%]',
                  message.role === 'assistant'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="p-1.5 rounded-full bg-neon-purple/20 shrink-0">
                <Bot className="w-4 h-4 text-neon-purple animate-pulse" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="min-h-[60px] max-h-[120px] pr-10 resize-none text-sm"
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2 h-7 w-7"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
