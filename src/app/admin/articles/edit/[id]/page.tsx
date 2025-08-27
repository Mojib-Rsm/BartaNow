
import { getArticleById } from "@/lib/api"
import { notFound } from "next/navigation"
import ArticleEditForm from "./article-edit-form"

type PageProps = {
    params: {
        id: string
    }
}

export default async function ArticleEditPage({ params }: PageProps) {
    const article = await getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div>
            <ArticleEditForm article={article} />
        </div>
    )
}
