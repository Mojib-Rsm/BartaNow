
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { useTheme } from 'next-themes';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const { theme } = useTheme();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // The 'dark' class will be on the html element, which Quill doesn't see directly.
  // We can't easily switch Quill's theme, but the default theme adapts reasonably well.
  // For a full dark theme, custom CSS would be required to override Quill's default styles.
  
  return (
    <div className={theme === 'dark' ? 'ql-dark' : ''}>
        <ReactQuill 
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder || 'আপনার কনটেন্ট এখানে লিখুন...'}
        />
    </div>
  );
}

// Add some basic dark theme support for Quill
const styles = `
.ql-dark .ql-editor {
    color: hsl(var(--foreground));
}
.ql-dark .ql-snow .ql-stroke {
    stroke: hsl(var(--border));
}
.ql-dark .ql-snow .ql-picker-label {
    color: hsl(var(--foreground));
}
.ql-dark .ql-snow .ql-fill, .ql-dark .ql-snow .ql-stroke.ql-fill {
    fill: hsl(var(--border));
}
.ql-dark .ql-toolbar {
    border-color: hsl(var(--border));
}
.ql-dark .ql-container {
    border-color: hsl(var(--border));
}
`;

if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
