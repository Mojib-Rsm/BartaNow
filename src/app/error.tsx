
'use client' 

import { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4">
        <AlertTriangle className="h-24 w-24 text-destructive/50 mb-6" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            একটি অপ্রত্যাশিত সমস্যা হয়েছে
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
            দুঃখিত, আমরা একটি অপ্রত্যাশিত সমস্যার সম্মুখীন হয়েছি। আপনি আবার চেষ্টা করতে পারেন অথবা আমাদের হোমপেজে ফিরে যেতে পারেন।
        </p>
        <div className="flex items-center gap-4">
            <Button onClick={() => reset()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                আবার চেষ্টা করুন
            </Button>
             <Button asChild variant="outline">
                <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                হোমে ফিরে যান
                </Link>
            </Button>
        </div>
    </div>
  )
}
