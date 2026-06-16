import { useQuery, useMutation } from "@tanstack/react-query";
import { getLyrics } from "../api/genius/getLyrics";
import { getLyricsAnalysis } from "../api/gemini/getLyricsMeaning";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

interface Props {
    q: string;
}

const Lyrics = ({ q }: Props) => {
    const [analysis, setAnalysis] = useState<string | null>(null);

    // 1. Fetch lyrics (OK to auto-fetch)
    const {
        data: lyricsData,
        isFetching: isLyricsFetching,
        error: lyricsError,
    } = useQuery({
        queryKey: ["lyrics", q],
        queryFn: () => getLyrics(q),
        enabled: !!q,
    });

    // 2. Gemini analysis (MANUAL only)
    const {
        mutate: generateAnalysis,
        isPending: isAnalyzing,
        error: analysisError,
        isSuccess,
    } = useMutation({
        mutationFn: async () => {
            if (!lyricsData?.lyrics) throw new Error("No lyrics");
            return getLyricsAnalysis(lyricsData.lyrics);
        },
        onSuccess: (data) => {
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

            setAnalysis(text);
            console.log("AI analysis:", text);
        },
    });

    const lines = lyricsData?.lyrics.split("\n") ?? [];

    return (
        <div className="flex flex-col gap-1 text-whiteMain font-poppins">
            {lyricsError && (
                <p className="text-red-500">Error loading lyrics.</p>
            )}

            {isLyricsFetching ? (
                <CircularProgress />
            ) : (
                <>
                    {/* BUTTON (hidden after success) */}
                    {!analysis && (
                        <button
                            onClick={() => generateAnalysis()}
                            disabled={isAnalyzing}
                            className="max-w-fit border border-purpleMain bg-purpleMain cursor-pointer rounded-[10px] text-whiteMain font-inter py-2 font-semibold px-8 sm:px-9 hover:opacity-90 transition my-3 disabled:opacity-50"
                        >
                            {isAnalyzing
                                ? "Analyzing..."
                                : "Get Lyrics Analysis with AI!"}
                        </button>
                    )}

                    {/* ERROR */}
                    {analysisError && (
                        <p className="text-red-400 text-sm">
                            Could not generate analysis.
                        </p>
                    )}

                    {/* ANALYSIS OUTPUT */}
                    {analysis && (
                        <div className="bg-neutral-900 p-4 rounded-xl max-w-[70%] border border-neutral-800 my-2">
                            <p className="text-whiteMain whitespace-pre-wrap text-sm leading-relaxed">
                                {analysis}
                            </p>
                        </div>
                    )}

                    {/* LYRICS */}
                    <div className="mt-4 space-y-1">
                        {lines.map((line, index) => (
                            <p key={index} className="min-h-[1.5rem]">
                                {line}
                            </p>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Lyrics;
