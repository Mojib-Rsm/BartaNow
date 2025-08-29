'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const { theme } = useTheme();
    const apiKey = "8qc0gdfs2nrsdczkqmlz9zl6e1rmyxg97decp49mgggnakm1";

    const handleImageUpload = async (blobInfo: any, success: (url: string) => void, failure: (err: string) => void) => {
        const file = blobInfo.blob();
        if (!file) return;

        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
            
            const result = await uploadInArticleImageAction(base64, blobInfo.filename());

            if ('location' in result) {
                success(result.location);
            } else {
                throw new Error(result.error.message);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Image upload failed';
            failure(message);
        }
    };

    return (
        <Editor
            apiKey={apiKey}
            value={value}
            onEditorChange={onChange}
            init={{
                height: 500,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media | help',
                content_style: 'body { font-family: "Noto Sans Bengali", sans-serif; font-size:16px }',
                skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: theme === 'dark' ? 'dark' : 'default',
                images_upload_handler: handleImageUpload,
                automatic_uploads: true,
                file_picker_types: 'image media',
            }}
        />
    );
}
