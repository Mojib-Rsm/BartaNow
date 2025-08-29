
'use client';

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from './ui/separator';

type CustomEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const CustomEditor = ({ value, onChange }: CustomEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput(); // Update state after command
  };
  
  const handleFormatBlock = (tag: string) => {
      handleCommand('formatBlock', `<${tag}>`);
  }

  return (
    <div className="border rounded-md">
        <div className="p-2 border-b flex items-center gap-2 flex-wrap">
             <ToggleGroup type="multiple" size="sm">
                <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleCommand('bold')}>
                    <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleCommand('italic')}>
                    <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => handleCommand('underline')}>
                    <Underline className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
            <Separator orientation="vertical" className="h-8" />
             <ToggleGroup type="single" size="sm">
                <ToggleGroupItem value="h1" aria-label="Toggle H1" onClick={() => handleFormatBlock('h1')}>
                    <Heading1 className="h-4 w-4" />
                </ToggleGroupItem>
                 <ToggleGroupItem value="h2" aria-label="Toggle H2" onClick={() => handleFormatBlock('h2')}>
                    <Heading2 className="h-4 w-4" />
                </ToggleGroupItem>
                 <ToggleGroupItem value="h3" aria-label="Toggle H3" onClick={() => handleFormatBlock('h3')}>
                    <Heading3 className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
             <Separator orientation="vertical" className="h-8" />
            <ToggleGroup type="single" size="sm">
                 <ToggleGroupItem value="ul" aria-label="Toggle UL" onClick={() => handleCommand('insertUnorderedList')}>
                    <List className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
        <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="prose dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
            dangerouslySetInnerHTML={{ __html: value }}
        />
    </div>
  );
};

export default CustomEditor;
