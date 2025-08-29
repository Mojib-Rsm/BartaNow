
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useTheme } from 'next-themes';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type RichTextEditorProps = {
  value: string;
  onEditorChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onEditorChange, placeholder }: RichTextEditorProps) {
    const { theme } = useTheme();

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className={theme === 'dark' ? 'quill-dark' : ''}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onEditorChange}
                modules={modules}
                placeholder={placeholder || 'আপনার কনটেন্ট এখানে লিখুন...'}
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            />
             <style jsx global>{`
                .quill-dark .ql-toolbar {
                    background: hsl(var(--card));
                    border-color: hsl(var(--border));
                }
                .quill-dark .ql-container {
                    background: hsl(var(--card));
                    border-color: hsl(var(--border));
                    color: hsl(var(--card-foreground));
                }
                .quill-dark .ql-editor {
                    color: hsl(var(--card-foreground));
                }
                .quill-dark .ql-snow .ql-stroke {
                    stroke: hsl(var(--primary-foreground));
                }
                 .quill-dark .ql-snow .ql-picker-label {
                    color: hsl(var(--primary-foreground));
                }
            `}</style>
        </div>
    );
}
