import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  initialCode = "", 
  language = "javascript", 
  readOnly = false 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput([]);
    
    try {
      // Simulate code execution (in a real app, you'd send this to a backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (language === 'javascript') {
        // Mock JavaScript execution
        const lines = code.split('\n');
        const results: string[] = [];
        
        for (const line of lines) {
          if (line.trim().startsWith('console.log')) {
            const match = line.match(/console\.log\((.*)\)/);
            if (match) {
              try {
                // Simple evaluation for demo purposes
                const expr = match[1].replace(/"/g, '').replace(/'/g, '');
                if (expr.includes('+')) {
                  const parts = expr.split('+').map(p => p.trim());
                  if (parts.every(p => !isNaN(Number(p)))) {
                    const sum = parts.reduce((acc, p) => acc + Number(p), 0);
                    results.push(sum.toString());
                  } else {
                    results.push(parts.join(' '));
                  }
                } else {
                  results.push(expr);
                }
              } catch {
                results.push(match[1]);
              }
            }
          }
        }
        
        setOutput(results.length > 0 ? results : ['// No console.log statements found']);
      } else {
        setOutput(['// Code execution not implemented for ' + language]);
      }
    } catch (error) {
      setOutput(['Error: ' + (error as Error).message]);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <i className="fas fa-code text-primary"></i>
          <span>Interactive Code Editor</span>
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyCode}
            data-testid="button-copy-code"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          {!readOnly && (
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              data-testid="button-run-code"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Code Input */}
        <div className="border-r border-gray-200">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {language}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full h-64 p-4 bg-code-bg text-code-text font-mono text-sm resize-none focus:outline-none"
            placeholder={`Write your ${language} code here...`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            data-testid="textarea-code-editor"
          />
        </div>
        
        {/* Output */}
        <div>
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Output</span>
          </div>
          <div className="h-64 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
            {isRunning ? (
              <div className="text-yellow-400">Running code...</div>
            ) : output.length > 0 ? (
              output.map((line, index) => (
                <div key={index} data-testid={`output-line-${index}`}>
                  {line}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Click "Run Code" to see output</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
