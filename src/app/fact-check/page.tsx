import { getArticles } from '@/lib/api';
import FactCheckCard from '@/components/fact-check-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'তথ্য যাচাই',
  description: 'বার্তা নাও থেকে সর্বশেষ যাচাইকৃত তথ্য এবং ফ্যাক্ট-চেক রিপোর্ট।',
};

export default async function FactCheckPage() {
  const { articles } = await getArticles({ category: 'তথ্য-যাচাই', limit: 100 });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline text-primary border-b-2 border-primary pb-2">
          তথ্য যাচাই
        </h1>
        <p className="text-muted-foreground mt-2">
          এখানে সামাজিক মাধ্যম এবং বিভিন্ন নিউজে প্রচারিত তথ্যের সত্যতা যাচাই করা হয়।
        </p>
      </header>
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <FactCheckCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">দুঃখিত, কোনো তথ্য যাচাই আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}
