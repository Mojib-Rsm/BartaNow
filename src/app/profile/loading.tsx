
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ProfileLoading() {
  return (
     <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader className="items-center text-center">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-40" />
            </div>
             <div className="pt-4 flex justify-end">
                <Skeleton className="h-10 w-36" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
