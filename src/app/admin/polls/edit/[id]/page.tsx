
import { getPollById } from "@/lib/api";
import { notFound } from "next/navigation";
import PollForm from "../../create/poll-form";

type PageProps = {
    params: {
        id: string;
    };
};

export default async function EditPollPage({ params }: PageProps) {
    const poll = await getPollById(params.id);

    if (!poll) {
        notFound();
    }

    return <PollForm poll={poll} />;
}
