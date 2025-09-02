
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

function SearchInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`/search?${params.toString()}`);
  }, 300);

  const clearSearch = () => {
    setInputValue('');
    router.replace('/search');
  };

  return (
    <div className="relative flex items-center">
       <Search className={cn(
           "absolute left-3 h-5 w-5 text-muted-foreground transition-all",
           isFocused && "text-primary"
        )} />
      <Input
        type="search"
        placeholder="অনুসন্ধান করুন..."
        className="pl-10 pr-4"
        value={inputValue}
        onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
       {inputValue && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 h-7 w-7 rounded-full"
            onClick={clearSearch}
            >
             <X className="h-4 w-4" />
          </Button>
       )}
    </div>
  );
}

export default function SearchInput() {
    return (
        <Suspense fallback={<div className="h-10 w-full max-w-xs rounded-md bg-muted" />}>
            <SearchInputContent />
        </Suspense>
    )
}
