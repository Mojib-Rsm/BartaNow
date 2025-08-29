
'use client';

import React, { useCallback, useRef } from 'react';
import { Bold, Italic, Underline, List, Heading1, Heading2 } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const ToolbarButton = ({ command, icon: Icon }: { command: string, icon: React.ElementType }) => {
    const handleExecCommand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.execCommand(command, false);
    };
    return (
        <Toggle size="sm" onPressedChange={() => document.execCommand(command, false)} aria-label={command}>
            <Icon className="h-4 w-4" />
        </Toggle>
    );
};

const HeadingButton = ({ level }: { level: 1 | 2 }) => {
    const handleExecCommand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.execCommand('formatBlock', false, `h${level}`);
    };
    const Icon = level === 1 ? Heading1 : Heading2;
    return (
        <Toggle size="sm" onPressedChange={handleExecCommand} aria-label={`heading ${level}`}>
            <Icon className="h-4 w-4" />
        </Toggle>
    );
};


export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
        onChange(event.currentTarget.innerHTML);
    }, [onChange]);
    
    return (
        <div className="rounded-md border border-input bg-background">
            <div className="p-2 border-b flex items-center gap-1 flex-wrap">
                <HeadingButton level={1} />
                <HeadingButton level={2} />
                <Separator orientation="vertical" className="h-6" />
                <ToolbarButton command="bold" icon={Bold} />
                <ToolbarButton command="italic" icon={Italic} />
                <ToolbarButton command="underline" icon={Underline} />
                <Separator orientation="vertical" className="h-6" />
                <ToolbarButton command="insertUnorderedList" icon={List} />
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                className="min-h-[250px] w-full p-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none"
            />
        </div>
    );
}
