import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  Loader2,
  Code,
  Bug,
  Wand2,
  TestTube,
  FileText,
  Zap,
  Search,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { cn } from '@/lib/utils';

interface DemoAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: (code: string) => Promise<any>;
}

const sampleCode = `function fetchUserData(userId) {
  return fetch('/api/users/' + userId)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(data => {
      console.log(data);
      return data;
    });
}

function processItems(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].active == true) {
      result.push(items[i].name.toUpperCase());
    }
  }
  return result;
}

class UserManager {
  constructor() {
    this.users = [];
  }
  
  addUser(name, email) {
    this.users.push({ name: name, email: email, id: Math.random() });
  }
  
  findUser(id) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id == id) {
        return this.users[i];
      }
    }
    return null;
  }
}`;

export default function AIDemo() {
  const [code, setCode] = useState(sampleCode);
  const [result, setResult] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('explain');
  const [copied, setCopied] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('python');

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
    findDeadCode,
    convertCode
  } = useDeepSeekAI();

  const demoActions: DemoAction[] = [
    {
      id: 'explain',
      name: 'Explain Code',
      description: 'Get a detailed explanation of what the code does',
      icon: <FileText className="w-4 h-4" />,
      action: (c) => explainCode(c, 'javascript')
    },
    {
      id: 'fix',
      name: 'Fix Bugs',
      description: 'Identify and fix bugs in the code',
      icon: <Bug className="w-4 h-4" />,
      action: (c) => fixCode(c)
    },
    {
      id: 'refactor',
      name: 'Refactor',
      description: 'Improve code structure and patterns',
      icon: <Wand2 className="w-4 h-4" />,
      action: (c) => refactorCode(c)
    },
    {
      id: 'optimize',
      name: 'Optimize',
      description: 'Improve performance and efficiency',
      icon: <Zap className="w-4 h-4" />,
      action: (c) => optimizeCode(c)
    },
    {
      id: 'tests',
      name: 'Generate Tests',
      description: 'Create unit tests for the code',
      icon: <TestTube className="w-4 h-4" />,
      action: (c) => generateTests(c, 'Jest')
    },
    {
      id: 'document',
      name: 'Add Docs',
      description: 'Add documentation and comments',
      icon: <FileText className="w-4 h-4" />,
      action: (c) => documentCode(c)
    },
    {
      id: 'readability',
      name: 'Improve Readability',
      description: 'Make code easier to understand',
      icon: <Search className="w-4 h-4" />,
      action: (c) => improveReadability(c)
    },
    {
      id: 'deadcode',
      name: 'Find Dead Code',
      description: 'Identify unused code',
      icon: <Search className="w-4 h-4" />,
      action: (c) => findDeadCode(c)
    }
  ];

  const handleAction = async () => {
    const action = demoActions.find(a => a.id === selectedAction);
    if (!action) return;

    setResult(null);
    const response = await action.action(code);
    
    if (response.success && response.data) {
      setResult(response.data);
    }
  };

  const handleConvert = async () => {
    setResult(null);
    const response = await convertCode(code, 'javascript', targetLanguage);
    
    if (response.success && response.data) {
      setResult(response.data);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <div key={index} className="my-3 rounded-lg overflow-hidden border border-border">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 text-xs text-muted-foreground">
                <span className="font-medium">{lang || 'code'}</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm bg-editor">
                <code className="text-foreground">{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      return <p key={index} className="text-sm whitespace-pre-wrap my-2">{part}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
              <Sparkles className="w-8 h-8 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DeepSeek V3 AI Demo</h1>
              <p className="text-muted-foreground">
                Explore all AI features powered by DeepSeek-V3-0324 via Bytez.js
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Code Input */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Input Code
                </CardTitle>
                <CardDescription>
                  Paste or edit code to analyze with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm resize-none"
                  placeholder="Paste your code here..."
                />
              </CardContent>
            </Card>

            {/* Action Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={selectedAction} onValueChange={setSelectedAction}>
                  <TabsList className="grid grid-cols-4 h-auto gap-1">
                    {demoActions.slice(0, 4).map((action) => (
                      <TabsTrigger
                        key={action.id}
                        value={action.id}
                        className="text-xs py-2"
                      >
                        {action.icon}
                        <span className="ml-1 hidden sm:inline">{action.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsList className="grid grid-cols-4 h-auto gap-1 mt-1">
                    {demoActions.slice(4).map((action) => (
                      <TabsTrigger
                        key={action.id}
                        value={action.id}
                        className="text-xs py-2"
                      >
                        {action.icon}
                        <span className="ml-1 hidden sm:inline">{action.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {demoActions.find(a => a.id === selectedAction)?.description}
                  </p>
                  <Button
                    onClick={handleAction}
                    disabled={loading || !code.trim()}
                    className="gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Run
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Language Conversion */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Convert Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">JavaScript</Badge>
                  <ChevronDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="c++">C++</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleConvert}
                    disabled={loading || !code.trim()}
                    variant="outline"
                    className="ml-auto"
                  >
                    Convert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4">
            <Card className="h-full min-h-[600px] flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Response
                  </CardTitle>
                  {result && (
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
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple animate-spin" />
                        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-neon-cyan" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        DeepSeek V3 is analyzing your code...
                      </p>
                    </motion.div>
                  </div>
                ) : result ? (
                  <ScrollArea className="flex-1">
                    <div className="pr-4">
                      {formatResult(result)}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                      <p className="text-sm text-muted-foreground">
                        Select an action and click Run to see AI-powered analysis of your code.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">All AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <FileText />, title: 'Code Explanation', desc: 'Understand any code in detail' },
              { icon: <Bug />, title: 'Bug Detection', desc: 'Find and fix errors automatically' },
              { icon: <Wand2 />, title: 'Refactoring', desc: 'Improve code structure' },
              { icon: <TestTube />, title: 'Test Generation', desc: 'Create comprehensive tests' },
              { icon: <Zap />, title: 'Optimization', desc: 'Improve performance' },
              { icon: <FileText />, title: 'Documentation', desc: 'Add comments and docs' },
              { icon: <RefreshCw />, title: 'Language Conversion', desc: 'Convert to any language' },
              { icon: <Search />, title: 'Dead Code Detection', desc: 'Find unused code' },
            ].map((feature, i) => (
              <Card key={i} className="hover:border-neon-cyan/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 w-fit">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
