
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { importWordPressAction } from '@/app/actions';
import { UploadCloud, X, Loader2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/xml': ['.xml'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'কোনো ফাইল নির্বাচন করা হয়নি',
        description: 'অনুগ্রহ করে একটি WordPress XML ফাইল নির্বাচন করুন।',
      });
      return;
    }

    setLoading(true);

    try {
      const fileContent = await file.text();
      const result = await importWordPressAction(fileContent);

      if (result.success) {
        toast({
          title: 'ইম্পোর্ট সফল',
          description: result.message,
        });
        setFile(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'ইম্পোর্ট ব্যর্থ',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'ত্রুটি',
        description: 'ফাইলটি পড়তে বা প্রসেস করতে একটি সমস্যা হয়েছে।',
      });
    }

    setLoading(false);
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
        {file ? (
          <p className="mt-4 text-lg font-semibold">{file.name}</p>
        ) : (
          <>
            <p className="mt-4 text-lg font-semibold">XML ফাইল টেনে এনে ছাড়ুন</p>
            <p className="text-sm text-muted-foreground">অথবা এখানে ক্লিক করে ফাইল নির্বাচন করুন</p>
          </>
        )}
      </div>

      {file && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
            <X className="h-4 w-4" />
            </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleImport} disabled={loading || !file}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ইম্পোর্ট হচ্ছে...
            </>
          ) : (
            'ইম্পোর্ট শুরু করুন'
          )}
        </Button>
      </div>
    </div>
  );
}
