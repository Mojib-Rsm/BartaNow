
'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

type RichTextEditorProps = {
  value: string;
  onEditorChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onEditorChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();

  const handleImageUpload = async (blobInfo: any, success: any, failure: any, progress: any) => {
      const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(blobInfo.blob());
      });

      try {
          const result = await uploadInArticleImageAction(base64, blobInfo.blob().name);
          if ('location' in result) {
              success(result.location);
          } else {
              failure(`Image upload failed: ${result.error.message}`);
          }
      } catch (error) {
           const message = error instanceof Error ? error.message : 'Unknown error';
           failure(`HTTP Error: ${message}`);
      }
  };

  return (
      <Editor
        apiKey="no-api-key"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onEditorChange}
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
          content_style: 'body { font-family:Noto Sans Bengali,PT Sans,sans-serif; font-size:16px }',
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          placeholder: placeholder || 'আপনার কনটেন্ট এখানে লিখুন...',
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image media',
        }}
      />
  );
}
