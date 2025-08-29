
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

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const { theme } = useTheme();

  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: 'edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
          'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
          'media', 'table', 'code', 'help', 'wordcount', 'emoticons', 'mediaembed'
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
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: async (blobInfo) => {
            const file = blobInfo.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64String = reader.result as string;
                    try {
                        const result = await uploadInArticleImageAction(base64String, blobInfo.filename());
                        if ('location' in result) {
                            resolve(result.location);
                        } else {
                            reject(result.error.message);
                        }
                    } catch (error) {
                        reject('Image upload failed');
                    }
                };
                reader.onerror = () => {
                    reject('File reading failed');
                };
                reader.readAsDataURL(file);
            });
        },
        media_live_embeds: true,
      }}
    />
  );
}
