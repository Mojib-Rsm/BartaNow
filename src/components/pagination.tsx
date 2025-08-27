import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

export default function Pagination({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav className="flex justify-center items-center gap-4">
      <Button asChild variant="outline" disabled={!hasPreviousPage}>
        <Link href={hasPreviousPage ? `${basePath}?page=${currentPage - 1}` : '#'}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          পূর্ববর্তী
        </Link>
      </Button>

      <span className="text-sm text-muted-foreground">
        পৃষ্ঠা {new Intl.NumberFormat('bn-BD').format(currentPage)} এর মধ্যে {new Intl.NumberFormat('bn-BD').format(totalPages)}
      </span>

      <Button asChild variant="outline" disabled={!hasNextPage}>
        <Link href={hasNextPage ? `${basePath}?page=${currentPage + 1}` : '#'}>
          পরবর্তী
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}
