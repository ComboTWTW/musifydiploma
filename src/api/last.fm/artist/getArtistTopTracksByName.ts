const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getTopTracksByName = async (
    name: string,
): Promise<ArtistTopTracksByNameT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${name}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: ArtistTopTracksByNameT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type ArtistTopTracksByNameT = {
    toptracks: {
        track: [
            {
                name: string;
                playcount: string;
                listeners: string;
                mbid: string;
                url: string;
                streamable: string;
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
                "@attr": {
                    rank: string;
                };
            },
        ];
        "@attr": {
            artist: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
};
