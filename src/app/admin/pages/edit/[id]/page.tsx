
import { getPageById } from "@/lib/api"
import { notFound } from "next/navigation"
import PageEditForm from "./page-edit-form"

type PageProps = {
    params: {
        id: string
    }
}

export default async function PageEditPage({ params }: PageProps) {
    const page = await getPageById(params.id);

    if (!page) {
        notFound();
    }

    return (
        <div>
            <PageEditForm page={page} />
        </div>
    )
}
