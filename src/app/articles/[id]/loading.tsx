import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <header className="mb-8 space-y-4">
        <Skeleton className="h-10 md:h-14 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-6 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </header>

      <Skeleton className="h-64 md:h-96 w-full mb-8 rounded-lg" />
      
      <div className="space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
}
