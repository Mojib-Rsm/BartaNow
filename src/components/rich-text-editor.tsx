
'use client';

import React, { useCallback, useReducer, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3,
  Pilcrow, Quote, Code, Link2, Image as ImageIcon, Minus, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Table
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type EditorState = {
  history: string[];
  historyIndex: number;
};

type Action = 
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: EditorState = {
  history: [''],
  historyIndex: 0,
};

function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'UPDATE_CONTENT': {
      if (action.payload === state.history[state.historyIndex]) {
        return state;
      }
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(action.payload);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    case 'UNDO': {
      return {
        ...state,
        historyIndex: Math.max(0, state.historyIndex - 1),
      };
    }
    case 'REDO': {
        return {
            ...state,
            historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
        };
    }
    default:
      return state;
  }
}

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const ToolbarButton = ({ command, icon: Icon, arg, title }: { command: string; icon: React.ElementType; arg?: string, title: string }) => {
    const handleExecCommand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.execCommand(command, false, arg);
    };
    return (
        <Button title={title} type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleExecCommand}>
            <Icon className="h-4 w-4" />
        </Button>
    );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [state, dispatch] = useReducer(editorReducer, { ...initialState, history: [value] });

    const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
        const newContent = event.currentTarget.innerHTML;
        onChange(newContent);
        dispatch({ type: 'UPDATE_CONTENT', payload: newContent });
    }, [onChange]);

    const handleUndo = () => dispatch({ type: 'UNDO' });
    const handleRedo = () => dispatch({ type: 'REDO' });

    const handleLink = () => {
        const url = prompt("Enter the URL");
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };
    
    const handleImage = () => {
        const url = prompt("Enter the Image URL");
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    };

    const handleTable = () => {
        const rows = parseInt(prompt("Enter number of rows", "2") || "0");
        const cols = parseInt(prompt("Enter number of columns", "2") || "0");
        if (rows > 0 && cols > 0) {
            let table = '<table style="border-collapse: collapse; width: 100%;">';
            for (let i = 0; i < rows; i++) {
                table += '<tr>';
                for (let j = 0; j < cols; j++) {
                    table += '<td style="border: 1px solid #ddd; padding: 8px;">Cell</td>';
                }
                table += '</tr>';
            }
            table += '</table>';
            document.execCommand('insertHTML', false, table);
        }
    }
    
    // This effect updates the editor's content when state changes (e.g., undo/redo)
    React.useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== state.history[state.historyIndex]) {
            editorRef.current.innerHTML = state.history[state.historyIndex];
            onChange(state.history[state.historyIndex]);
        }
    }, [state.history, state.historyIndex, onChange]);


    return (
        <div className="rounded-md border border-input bg-background">
            <div className="p-1 border-b flex items-center gap-1 flex-wrap">
                <ToolbarButton command="undo" icon={Undo} title="Undo" />
                <ToolbarButton command="redo" icon={Redo} title="Redo" />
                <Separator orientation="vertical" className="h-8 mx-1" />
                <ToolbarButton command="formatBlock" icon={Heading1} arg="h1" title="Heading 1" />
                <ToolbarButton command="formatBlock" icon={Heading2} arg="h2" title="Heading 2" />
                <ToolbarButton command="formatBlock" icon={Heading3} arg="h3" title="Heading 3" />
                <ToolbarButton command="formatBlock" icon={Pilcrow} arg="p" title="Paragraph" />
                <ToolbarButton command="formatBlock" icon={Quote} arg="blockquote" title="Blockquote" />
                <ToolbarButton command="formatBlock" icon={Code} arg="pre" title="Code Block" />
                <Separator orientation="vertical" className="h-8 mx-1" />
                <ToolbarButton command="bold" icon={Bold} title="Bold" />
                <ToolbarButton command="italic" icon={Italic} title="Italic" />
                <ToolbarButton command="underline" icon={Underline} title="Underline" />
                <ToolbarButton command="strikeThrough" icon={Strikethrough} title="Strikethrough" />
                <Separator orientation="vertical" className="h-8 mx-1" />
                <ToolbarButton command="insertUnorderedList" icon={List} title="Bulleted List" />
                <ToolbarButton command="insertOrderedList" icon={ListOrdered} title="Numbered List" />
                <ToolbarButton command="justifyLeft" icon={AlignLeft} title="Align Left" />
                <ToolbarButton command="justifyCenter" icon={AlignCenter} title="Align Center" />
                <ToolbarButton command="justifyRight" icon={AlignRight} title="Align Right" />
                <Separator orientation="vertical" className="h-8 mx-1" />
                <Button title="Insert Link" type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleLink}><Link2 className="h-4 w-4" /></Button>
                <Button title="Insert Image" type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleImage}><ImageIcon className="h-4 w-4" /></Button>
                <Button title="Insert Table" type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleTable}><Table className="h-4 w-4" /></Button>
                <ToolbarButton command="insertHorizontalRule" icon={Minus} title="Horizontal Line" />
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                className="min-h-[350px] w-full p-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none"
            />
        </div>
    );
}
