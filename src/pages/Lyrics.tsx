import { useQuery } from "@tanstack/react-query";
import { getLyrics } from "../api/genius/getLyrics";

interface Props {
    q: string;
}

const Lyrics = ({ q }: Props) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["lyrics", q],
        queryFn: () => getLyrics(q),
        enabled: !!q,
    });

    if (isLoading)
        return <p className="text-whiteMain font-poppins">Loading...</p>;
    if (error)
        return (
            <p className="text-whiteMain font-poppins">No Lyrics Provided</p>
        );

    const lines = data?.lyrics.split("\n") ?? [];

    console.log(data);

    return (
        <div className="flex flex-col gap-1 text-whiteMain font-poppins">
            {lines.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
};

export default Lyrics;
