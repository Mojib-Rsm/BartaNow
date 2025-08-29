

import { getMediaById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MediaEditForm from "./media-edit-form";

type PageProps = {
    params: {
        id: string;
    };
};

async function MediaEditContent({ id }: { id: string }) {
    const media = await getMediaById(id);

    if (!media) {
        notFound();
    }

    return <MediaEditForm media={media} />;
}

export default function MediaEditPage({ params }: PageProps) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <MediaEditContent id={params.id} />
        </Suspense>
    );
}
