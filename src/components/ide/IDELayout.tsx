import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ActivityBar } from './ActivityBar';
import { Sidebar } from './Sidebar';
import { EditorTabs } from './EditorTabs';
import { MonacoEditor } from './MonacoEditor';
import { StatusBar } from './StatusBar';
import { CommandPalette } from './CommandPaletteEnhanced';
import { AIContextMenu } from './AIContextMenu';
import { useIDEStore } from '@/stores/ideStore';

export function IDELayout() {
  const { sidebarVisible, settings, openFiles, editorGroups, activeGroupId } = useIDEStore();
  
  // Get current file for context menu
  const activeGroup = editorGroups.find(g => g.id === activeGroupId);
  const activeTab = activeGroup?.tabs.find(t => t.id === activeGroup.activeTabId);
  const activeFile = openFiles.find(f => f.id === activeTab?.id);
  
  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity bar */}
        <ActivityBar />
        
        {/* Resizable sidebar and editor */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <AnimatePresence mode="wait">
            {sidebarVisible && (
              <ResizablePanel 
                defaultSize={20} 
                minSize={15} 
                maxSize={40}
                className="min-w-[200px]"
              >
                <Sidebar />
              </ResizablePanel>
            )}
          </AnimatePresence>
          
          {sidebarVisible && <ResizableHandle withHandle />}
          
          {/* Editor area with AI context menu */}
          <ResizablePanel defaultSize={80}>
            <AIContextMenu 
              selectedCode={activeFile?.content || ''}
              language={activeFile?.language}
            >
              <div className="h-full flex flex-col bg-editor">
                {/* Tabs */}
                <EditorTabs />
                
                {/* Monaco Editor */}
                <MonacoEditor />
              </div>
            </AIContextMenu>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Status bar */}
      <StatusBar />
      
      {/* Command palette */}
      <CommandPalette />
    </div>
  );
}
