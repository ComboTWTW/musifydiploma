const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSimilarTracks = async (
    trackMbid: string,
): Promise<similarTracksT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&api_key=${apiKey}&format=json&mbid=${trackMbid}`;

    try {
        const res = await fetch(link);
        const data: similarTracksT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type similarTracksT = {
    similartracks: {
        track: [
            {
                name: string;
                playcount: number;
                mbid: string;
                match: number;
                url: string;
                streamable: {
                    "#text": string;
                    fulltrack: string;
                };
                duration: 0;
                artist: {
                    name: string;
                    mbid: string;
                    url: string;
                };
                image: [
                    {
                        "#text": string;
                        size: string;
                    },
                    {
                        "#text": string;
                        size: string;
                    },
                    {
                        "#text": string;
                        size: string;
                    },
                    {
                        "#text": string;
                        size: string;
                    },
                ];
            },
        ];
        "@attr": {
            artist: string;
            track: string;
        };
    };
};
