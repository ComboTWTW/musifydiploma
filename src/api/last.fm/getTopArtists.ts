const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getTopArtists = async (): Promise<topArtistsT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: topArtistsT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type topArtistsT = {
    artists: {
        artist: {
            name: string;
            playcount: string;
            listeners: string;
            mbid: string;
            url: string;
            streamable: string;
            image: [
                {
                    "#text": string;
                    size: string;
                },
            ];
        }[];
        "@attr": {
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
};
