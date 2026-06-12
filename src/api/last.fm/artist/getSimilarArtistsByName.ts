const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSimilarArtistsByName = async (
    name: string,
): Promise<similarArtistsByNameT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${name}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: similarArtistsByNameT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type similarArtistsByNameT = {
    similarartists: {
        artist: [
            {
                name: string;
                mbid: string;
                match: string;
                url: string;
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
                    {
                        "#text": string;
                        size: string;
                    },
                    {
                        "#text": string;
                        size: string;
                    },
                ];
                streamable: string;
            },
        ];
        "@attr": {
            artist: string;
        };
    };
};
