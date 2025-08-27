
import { getArticleById, getAllAuthors } from "@/lib/api"
import { notFound } from "next/navigation"
import ArticleEditForm from "./article-edit-form"

type PageProps = {
    params: {
        id: string
    }
}

export default async function ArticleEditPage({ params }: PageProps) {
    const [article, authors] = await Promise.all([
        getArticleById(params.id),
        getAllAuthors()
    ]);

    if (!article) {
        notFound();
    }

    return (
        <div>
            <ArticleEditForm article={article} authors={authors} />
        </div>
    )
}
