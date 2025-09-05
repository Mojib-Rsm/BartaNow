
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { UploadCloud, Link as LinkIcon, Library, Image as ImageIcon } from 'lucide-react';
import { Input } from './ui/input';
import { MediaLibraryDialog } from './media-library-dialog';
import { useDropzone } from 'react-dropzone';

type ImageSelectorProps = {
  onImageSelect: (url: string) => void;
  initialValue?: string | null;
};

export default function ImageSelector({ onImageSelect, initialValue }: ImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState(initialValue || '');
  const [previewImage, setPreviewImage] = useState<string | null>(initialValue || null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreviewImage(base64String);
          onImageSelect(base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    multiple: false,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      setPreviewImage(url);
      onImageSelect(url);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    setPreviewImage(url);
    onImageSelect(url);
    setIsLibraryOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg min-h-[150px] w-full bg-muted/50">
        {previewImage ? (
          <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden">
            <Image src={previewImage} alt="Article preview" fill className="object-contain" />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12" />
            <p>এখানে ছবির প্রিভিউ দেখা যাবে</p>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload</TabsTrigger>
          <TabsTrigger value="library"><Library className="mr-2 h-4 w-4" />Library</TabsTrigger>
          <TabsTrigger value="url"><LinkIcon className="mr-2 h-4 w-4" />URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-4">
            <div {...getRootProps()} className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                <input {...getInputProps()} />
                <p>ফাইল টেনে এনে ছাড়ুন বা ক্লিক করে নির্বাচন করুন</p>
            </div>
        </TabsContent>
        <TabsContent value="library" className="mt-4">
            <Button onClick={() => setIsLibraryOpen(true)} className="w-full">
                <Library className="mr-2 h-4 w-4" />
                মিডিয়া লাইব্রেরি থেকে বেছে নিন
            </Button>
        </TabsContent>
        <TabsContent value="url" className="mt-4">
            <div className="flex gap-2">
                <Input
                    type="url"
                    placeholder="ছবির URL এখানে পেস্ট করুন"
                    value={imageUrl}
                    onChange={handleUrlChange}
                />
            </div>
        </TabsContent>
      </Tabs>
      
      <MediaLibraryDialog
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectImage={handleSelectFromLibrary}
      />
    </div>
  );
}
