
'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

// Import the necessary TinyMCE components.
// This approach is more stable with Next.js hot-reloading.
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide-dark/skin.min.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';


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
        // content_css is not needed when skins are imported directly
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        file_picker_types: 'image media',
      }}
    />
  );
}
