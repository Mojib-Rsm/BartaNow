
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

// TinyMCE so brittle. See https://www.tiny.cloud/docs/tinymce/latest/react-ref/
export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key';

  return (
    <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(newValue, editor) => {
            onChange(newValue);
        }}
        init={{
            height: 400,
            menubar: true,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family: "Noto Sans Bengali", sans-serif; font-size:16px }',
            skin: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "oxide-dark" : "oxide",
            content_css: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "default",
        }}
    />
  );
}
