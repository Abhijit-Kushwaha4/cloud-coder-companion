import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FolderPlus,
  Loader2,
  Copy,
  Check,
  Code,
  Server,
  Globe,
  Database,
  Smartphone,
  Terminal,
  Layers,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { cn } from '@/lib/utils';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'react-vite',
    name: 'React + Vite',
    description: 'Modern React app with Vite, TypeScript, and Tailwind CSS',
    icon: <Code className="w-5 h-5" />,
    tags: ['React', 'Vite', 'TypeScript', 'Tailwind'],
    category: 'frontend'
  },
  {
    id: 'nextjs',
    name: 'Next.js 14',
    description: 'Full-stack React framework with App Router and Server Components',
    icon: <Globe className="w-5 h-5" />,
    tags: ['Next.js', 'React', 'TypeScript', 'SSR'],
    category: 'fullstack'
  },
  {
    id: 'express-api',
    name: 'Express REST API',
    description: 'Node.js REST API with Express, TypeScript, and validation',
    icon: <Server className="w-5 h-5" />,
    tags: ['Express', 'Node.js', 'TypeScript', 'REST'],
    category: 'backend'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Modern Python API with FastAPI, Pydantic, and async support',
    icon: <Terminal className="w-5 h-5" />,
    tags: ['Python', 'FastAPI', 'Async', 'OpenAPI'],
    category: 'backend'
  },
  {
    id: 'express-prisma',
    name: 'Express + Prisma',
    description: 'Type-safe Node.js API with Prisma ORM and PostgreSQL',
    icon: <Database className="w-5 h-5" />,
    tags: ['Express', 'Prisma', 'PostgreSQL', 'TypeScript'],
    category: 'backend'
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile app with Expo and TypeScript',
    icon: <Smartphone className="w-5 h-5" />,
    tags: ['React Native', 'Expo', 'TypeScript', 'Mobile'],
    category: 'mobile'
  },
  {
    id: 'fullstack-t3',
    name: 'T3 Stack',
    description: 'Full-stack app with Next.js, tRPC, Prisma, and Tailwind',
    icon: <Layers className="w-5 h-5" />,
    tags: ['Next.js', 'tRPC', 'Prisma', 'Tailwind'],
    category: 'fullstack'
  },
  {
    id: 'python-cli',
    name: 'Python CLI',
    description: 'Command-line tool with Click, Rich, and proper packaging',
    icon: <Terminal className="w-5 h-5" />,
    tags: ['Python', 'CLI', 'Click', 'Rich'],
    category: 'backend'
  }
];

export function AIProjectGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const { loading, error, generateProject } = useDeepSeekAI();

  const handleGenerateFromTemplate = async () => {
    if (!selectedTemplate || !projectName.trim()) return;

    const options = {
      name: projectName.trim(),
      template: selectedTemplate.id,
      typescript: true,
      linting: true,
      testing: true
    };

    const result = await generateProject(selectedTemplate.name, options);
    
    if (result.success && result.data) {
      setGeneratedCode(result.data);
    }
  };

  const handleGenerateCustom = async () => {
    if (!customDescription.trim()) return;

    const result = await generateProject(customDescription.trim(), {
      name: projectName.trim() || 'my-project',
      custom: true
    });
    
    if (result.success && result.data) {
      setGeneratedCode(result.data);
    }
  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCode = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        if (match) {
          const [, lang, code] = match;
          return (
            <div key={index} className="my-3 rounded-lg overflow-hidden border border-border">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 text-xs text-muted-foreground">
                <span className="font-medium">{lang || 'file'}</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm bg-editor">
                <code className="text-foreground">{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      return <p key={index} className="text-sm text-foreground whitespace-pre-wrap my-2">{part}</p>;
    });
  };

  const filterTemplates = (category: string) => {
    if (category === 'all') return projectTemplates;
    return projectTemplates.filter(t => t.category === category);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
            <FolderPlus className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Project Generator</h1>
            <p className="text-sm text-muted-foreground">
              Create new projects with DeepSeek V3 AI
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Configuration */}
        <div className="w-[400px] border-r border-border flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="templates" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-neon-cyan py-3"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger 
                value="custom"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-neon-cyan py-3"
              >
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="flex-1 flex flex-col m-0 p-0">
              {/* Project Name Input */}
              <div className="p-4 border-b border-border">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Project Name
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="h-9"
                />
              </div>

              {/* Template Categories */}
              <div className="px-4 py-2 border-b border-border">
                <div className="flex gap-1.5">
                  {['all', 'frontend', 'backend', 'fullstack'].map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="cursor-pointer capitalize hover:bg-muted"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Template List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {projectTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-neon-cyan/50",
                        selectedTemplate?.id === template.id && "border-neon-cyan bg-neon-cyan/5"
                      )}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            {template.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            <CardDescription className="text-xs truncate">
                              {template.description}
                            </CardDescription>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <Check className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Generate Button */}
              <div className="p-4 border-t border-border">
                <Button
                  onClick={handleGenerateFromTemplate}
                  disabled={!selectedTemplate || !projectName.trim() || loading}
                  className="w-full gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Project
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="flex-1 flex flex-col m-0 p-0">
              <div className="p-4 space-y-4 flex-1 flex flex-col">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Project Name
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="my-custom-project"
                    className="h-9"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Describe Your Project
                  </label>
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Describe the project you want to create. Include details about:&#10;• Tech stack&#10;• Features&#10;• Database requirements&#10;• API endpoints&#10;• UI components"
                    className="flex-1 min-h-[200px] resize-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <Button
                  onClick={handleGenerateCustom}
                  disabled={!customDescription.trim() || loading}
                  className="w-full gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Custom Project
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Generated Output */}
        <div className="flex-1 flex flex-col">
          {error && (
            <div className="m-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
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
                  DeepSeek V3 is generating your project...
                </p>
              </motion.div>
            </div>
          ) : generatedCode ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-sm font-medium">Generated Project Structure</span>
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
                      Copy All
                    </>
                  )}
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                {formatCode(generatedCode)}
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center mx-auto mb-4">
                  <FolderPlus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Create a New Project</h3>
                <p className="text-sm text-muted-foreground">
                  Select a template or describe your custom project, then click Generate to create
                  a complete project structure powered by DeepSeek V3 AI.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
