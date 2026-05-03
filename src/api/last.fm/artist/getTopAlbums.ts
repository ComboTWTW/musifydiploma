const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getTopAlbums = async (mbid: string): Promise<ArtistTopAlbumsT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${mbid}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: ArtistTopAlbumsT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type ArtistTopAlbumsT = {
    topalbums: {
        album: {
            name: string;
            playcount: number;
            url: string;
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
        }[];
        "@attr": {
            artist: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
};
