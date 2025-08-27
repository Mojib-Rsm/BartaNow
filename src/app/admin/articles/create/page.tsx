
import { getAllAuthors } from "@/lib/api"
import ArticleCreateForm from "./article-create-form"

export default async function ArticleCreatePage() {
    const authors = await getAllAuthors();

    return (
        <div>
            <ArticleCreateForm authors={authors} />
        </div>
    )
}
