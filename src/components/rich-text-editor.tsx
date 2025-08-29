
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

type RichTextEditorProps = {
  value: string;
  onEditorChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onEditorChange, placeholder }: RichTextEditorProps) {
  const { resolvedTheme } = useTheme();

  const handleImageUpload = (blobInfo: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const result = await uploadInArticleImageAction(blobInfo.base64(), blobInfo.filename());
        if ('location' in result) {
            resolve(result.location);
        } else {
            reject(result.error.message);
        }
    });
  };

  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={(content) => onEditorChange(content)}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: resolvedTheme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: resolvedTheme === 'dark' ? 'dark' : 'default',
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        file_picker_types: 'image media',
      }}
    />
  );
}
