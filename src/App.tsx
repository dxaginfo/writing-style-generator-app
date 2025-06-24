import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

const writingStyles = [
  { id: 'tim-ferriss', name: 'Super Writer GPT (Tim Ferriss Style)' },
  { id: 'tim-ferriss-james-clear', name: 'Super Writer GPT (Tim Ferriss Style) + James Clear (20%)' },
  { id: 'shane-parrish', name: 'Insight Writer GPT (Shane Parrish Style)' },
  { id: 'mark-manson', name: 'Brutally Honest GPT (Mark Manson Style)' },
  { id: 'david-perell', name: 'Idea Curator GPT (David Perell Style)' },
];

interface HistoryItem {
  prompt: string;
  style: string;
  content: string;
  timestamp: Date;
}

function App() {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const generateContent = async () => {
    if (!selectedStyle || !prompt.trim()) {
      alert('Please select a style and enter a prompt');
      return;
    }

    setIsLoading(true);
    
    // In a real implementation, this would call an API
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock generated content
      const mockContent = `This is generated content for "${prompt}" in the ${selectedStyle} style.
      
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
      
      setGeneratedContent(mockContent);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        prompt,
        style: selectedStyle,
        content: mockContent,
        timestamp: new Date()
      };
      
      setHistory([newHistoryItem, ...history]);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportContent = (format: 'text' | 'markdown' | 'html') => {
    if (!generatedContent) {
      alert('No content to export');
      return;
    }

    let content = generatedContent;
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'markdown') {
      mimeType = 'text/markdown';
      fileExtension = 'md';
    } else if (format === 'html') {
      // Very simple HTML conversion for demo purposes
      content = `<!DOCTYPE html>
<html>
<head>
  <title>Generated Content</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Generated Content</h1>
  ${generatedContent.split('\n').map(line => `<p>${line}</p>`).join('')}
</body>
</html>`;
      mimeType = 'text/html';
      fileExtension = 'html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-content.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Content Creator Interface</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Writing Style</label>
              <Select value={selectedStyle} onValueChange={handleStyleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a writing style" />
                </SelectTrigger>
                <SelectContent>
                  {writingStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Enter Prompt</label>
              <Textarea
                placeholder="Enter your content prompt here..."
                rows={5}
                value={prompt}
                onChange={handlePromptChange}
              />
            </div>
            
            <Button 
              onClick={generateContent} 
              disabled={isLoading || !selectedStyle || !prompt.trim()}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate Content'}
            </Button>
            
            {generatedContent && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Generated Content</h2>
                <div className="p-4 border rounded-md bg-gray-50 whitespace-pre-line">
                  {generatedContent}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => exportContent('text')}>
                    Export as Text
                  </Button>
                  <Button variant="outline" onClick={() => exportContent('markdown')}>
                    Export as Markdown
                  </Button>
                  <Button variant="outline" onClick={() => exportContent('html')}>
                    Export as HTML
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Generation History</h2>
          
          {history.length === 0 ? (
            <p className="text-gray-500">No history yet. Generate some content first.</p>
          ) : (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Style: {item.style}</span>
                    <span className="text-sm text-gray-500">
                      {item.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Prompt: {item.prompt}</p>
                  <div className="p-3 bg-gray-50 rounded-md whitespace-pre-line text-sm">
                    {item.content.substring(0, 150)}
                    {item.content.length > 150 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;