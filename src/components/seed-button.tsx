
'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedAction();
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        // Redirect to install page
        router.push('/install');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      <Rocket className="mr-2 h-4 w-4" />
      {isLoading ? 'Seeding...' : 'Install Website'}
    </Button>
  );
}

    
