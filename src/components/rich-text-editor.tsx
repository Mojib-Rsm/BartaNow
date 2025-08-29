
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from './ui/separator';

type CustomEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const ToolbarButton = ({ command, icon: Icon, tag }: { command: string, icon: React.ElementType, tag?: string }) => {
    const handleExecCommand = (e: React.MouseEvent) => {
        e.preventDefault();
        if (tag) {
            document.execCommand('formatBlock', false, tag);
        } else {
            document.execCommand(command, false);
        }
    };
    return (
        <ToggleGroupItem value={command} onClick={handleExecCommand} className="h-8 w-8 p-1.5">
            <Icon className="h-4 w-4" />
        </ToggleGroupItem>
    );
};

export default function RichTextEditor({ value, onChange }: CustomEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Effect to set initial content, but only once.
    useEffect(() => {
        if (isClient && editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, value]); // Only run when `value` prop changes externally.

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    if (!isClient) {
        return <div className="border rounded-md min-h-[300px] p-2 bg-muted/50 animate-pulse" />;
    }

    return (
        <div className="w-full border rounded-md">
            <div className="toolbar p-2 border-b flex items-center gap-1 flex-wrap">
                <ToggleGroup type="multiple">
                    <ToolbarButton command="bold" icon={Bold} />
                    <ToolbarButton command="italic" icon={Italic} />
                    <ToolbarButton command="underline" icon={Underline} />
                </ToggleGroup>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToggleGroup type="single">
                     <ToolbarButton command="formatBlock" tag="h1" icon={Heading1} />
                     <ToolbarButton command="formatBlock" tag="h2" icon={Heading2} />
                     <ToolbarButton command="formatBlock" tag="h3" icon={Heading3} />
                </ToggleGroup>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToggleGroup type="multiple">
                    <ToolbarButton command="insertUnorderedList" icon={List} />
                </ToggleGroup>
            </div>
            <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleInput}
                suppressContentEditableWarning={true}
                className="prose dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
            />
        </div>
    );
}

