
import { getMediaById, getUserById } from "@/lib/api";
import { notFound } from "next/navigation";
import MediaDetailsForm from "./media-details-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type PageProps = {
    params: {
        id: string;
    };
};

async function MediaDetailsContent({ id }: { id: string }) {
    const media = await getMediaById(id);

    if (!media) {
        notFound();
    }
    
    const uploadedBy = await getUserById(media.uploadedBy);

    return <MediaDetailsForm media={media} uploadedBy={uploadedBy || null} />;
}

export default function MediaDetailsPage({ params }: PageProps) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <MediaDetailsContent id={params.id} />
        </Suspense>
    );
}
