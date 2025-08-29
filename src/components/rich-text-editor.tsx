
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const { theme } = useTheme();

  return (
    <Editor
      apiKey="no-api-key" // Using "no-api-key" allows full functionality with a domain warning. Replace with your own key for production.
      value={value}
      onEditorChange={onChange}
      init={{
        height: 350,
        menubar: 'edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
          'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
          'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic underline strikethrough | forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media | ' +
          'blockquote emoticons | removeformat | help',
        block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
        placeholder: placeholder || 'আপনার কনটেন্ট এখানে লিখুন...',
      }}
    />
  );
}
