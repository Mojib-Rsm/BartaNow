
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { uploadMediaAction } from '@/app/actions';
import { UploadCloud, X, Loader2, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type UploadFormProps = {
  userId: string;
};

export default function UploadForm({ userId }: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'কোনো ফাইল নির্বাচন করা হয়নি',
        description: 'অনুগ্রহ করে আপলোড করার জন্য ফাইল নির্বাচন করুন।',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let completedFiles = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      const result = await uploadMediaAction(formData);

      if (result.success) {
        toast({
          title: 'আপলোড সফল',
          description: `ফাইল '${file.name}' সফলভাবে আপলোড হয়েছে।`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'আপলোড ব্যর্থ',
          description: result.message,
        });
      }
      completedFiles++;
      setUploadProgress((completedFiles / totalFiles) * 100);
    }
    
    setUploading(false);
    setFiles([]);
    router.push('/admin/media');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-semibold">ফাইল টেনে এনে ছাড়ুন</p>
        <p className="text-sm text-muted-foreground">অথবা এখানে ক্লিক করে ফাইল নির্বাচন করুন</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">নির্বাচিত ফাইলসমূহ</h3>
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.name} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <File className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploading && (
        <div>
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center mt-2 text-muted-foreground">আপলোড হচ্ছে... {Math.round(uploadProgress)}%</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              আপলোড হচ্ছে...
            </>
          ) : (
            `আপলোড করুন (${files.length})`
          )}
        </Button>
      </div>
    </div>
  );
}
