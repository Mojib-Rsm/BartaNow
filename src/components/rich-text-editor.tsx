
'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

// Self-hosted imports
import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.css';

// Plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';


// Content CSS
import 'tinymce/skins/content/default/content.css';
import 'tinymce/skins/ui/oxide/content.css';
import 'tinymce/skins/content/dark/content.css';
import 'tinymce/skins/ui/oxide-dark/content.css';


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
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onEditorChange}
        init={{
          skin_url: '/skins/ui/oxide',
          content_css_url: [
            '/skins/ui/oxide/content.css',
            '/skins/content/default/content.css'
          ],
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
          placeholder: placeholder || 'আপনার কনটেন্ট এখানে লিখুন...',
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image media',
        }}
      />
  );
}
