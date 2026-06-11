export type LyricsResponse = {
    lyrics: string;
};

export const getLyrics = async (q: string): Promise<LyricsResponse> => {
    const res = await fetch(`http://localhost:3001/api/genius/lyrics?q=${q}`);

    if (!res.ok) {
        throw new Error("Failed to fetch lyrics");
    }

    return res.json();
};
