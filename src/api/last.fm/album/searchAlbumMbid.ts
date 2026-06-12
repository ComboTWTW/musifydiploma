const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSearchAlbumMbid = async (
    artistName: string,
    albumName: string,
): Promise<SearchAlbumMbidT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${artistName}&album=${albumName}&format=json`;

    try {
        const res = await fetch(link);
        const data: SearchAlbumMbidT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type SearchAlbumMbidT = {
    album: {
        artist: string;
        mbid: string;
        tags: {
            tag: [
                {
                    url: string;
                    name: string;
                },
            ];
        };
        name: string;
        image: [
            {
                size: "small";
                "#text": string;
            },
            {
                size: "medium";
                "#text": string;
            },
            {
                size: "large";
                "#text": string;
            },
            {
                size: "extralarge";
                "#text": string;
            },
            {
                size: "mega";
                "#text": string;
            },
            {
                size: "";
                "#text": string;
            },
        ];
        tracks: {
            track: [
                {
                    streamable: {
                        fulltrack: string;
                        "#text": string;
                    };
                    duration: number;
                    url: string;
                    name: string;
                    "@attr": {
                        rank: number;
                    };
                    artist: {
                        url: string;
                        name: string;
                        mbid: string;
                    };
                },
            ];
        };
        listeners: string;
        playcount: string;
        url: string;
    };
};
