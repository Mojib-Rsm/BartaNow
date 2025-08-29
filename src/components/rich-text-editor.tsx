
'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { uploadInArticleImageAction } from '@/app/actions';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef(null);
    const { resolvedTheme } = useTheme();

    const handleImageUpload = async (blobInfo: any): Promise<string> => {
        const file = blobInfo.blob();
        if (!file) throw new Error("No file selected");
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64String = reader.result as string;
                    const result = await uploadInArticleImageAction(base64String, blobInfo.filename());
                    if ('location' in result) {
                        resolve(result.location);
                    } else {
                        reject(result.error.message);
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Upload failed';
                    reject(`Image upload failed: ${message}`);
                }
            };
            reader.onerror = () => {
                reject('Error reading file');
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <Editor
            apiKey="no-api-key"
            onInit={(evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={(newValue, editor) => onChange(newValue)}
            init={{
                height: 500,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image media link | code | fullscreen preview | help',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size:14px }',
                skin: resolvedTheme === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: resolvedTheme === 'dark' ? 'dark' : 'default',
                images_upload_handler: handleImageUpload,
                automatic_uploads: true,
                file_picker_types: 'image media',
            }}
        />
    );
}
