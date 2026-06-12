const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getAlbumInfoByMbid = async (
    mbid: string,
): Promise<albumInfoByMbidT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&mbid=${mbid}&format=json`;

    try {
        const res = await fetch(link);
        const data: albumInfoByMbidT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type albumInfoByMbidT = {
    album: {
        name: string;
        artist: string;
        url: string;
        image: [
            {
                "#text": "";
                size: "small";
            },
            {
                "#text": "";
                size: "medium";
            },
            {
                "#text": "";
                size: "large";
            },
            {
                "#text": "";
                size: "extralarge";
            },
        ];
        streamable: string;
        mbid: string;
    };
};
