
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TinyEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const { theme } = useTheme();

  const handleEditorChange = (content: string, editor: any) => {
    onChange(content);
  };
  
  const handleImageUpload = (blobInfo: any, progress: (percent: number) => void): Promise<string> => 
    new Promise(async (resolve, reject) => {
      try {
        const result = await uploadInArticleImageAction(blobInfo.base64(), blobInfo.filename());
        if ('location' in result) {
            resolve(result.location);
        } else {
            reject(result.error.message);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Image upload failed';
        reject(message);
      }
  });


  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link | emoticons | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
        placeholder: placeholder || 'আপনার কনটেন্ট এখানে লিখুন...',
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: handleImageUpload,
      }}
    />
  );
}
