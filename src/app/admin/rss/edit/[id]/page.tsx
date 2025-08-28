
import { getRssFeedById } from "@/lib/api";
import { notFound } from "next/navigation";
import RssFeedForm from "../../create/rss-feed-form";

type PageProps = {
    params: {
        id: string;
    };
};

export default async function EditRssFeedPage({ params }: PageProps) {
    const feed = await getRssFeedById(params.id);

    if (!feed) {
        notFound();
    }

    return <RssFeedForm feed={feed} />;
}
