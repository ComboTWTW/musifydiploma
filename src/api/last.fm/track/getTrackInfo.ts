const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getTrackInfo = async (trackMbid: string): Promise<trackInfoT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&mbid=${trackMbid}&format=json`;

    try {
        const res = await fetch(link);
        const data: trackInfoT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type trackInfoT = {
    track: {
        name: string;
        mbid: string;
        url: string;
        duration: string;
        streamable: {
            "#text": string;
            fulltrack: string;
        };
        listeners: string;
        playcount: string;
        artist: {
            name: string;
            mbid: string;
            url: string;
        };
        album: {
            artist: string;
            title: string;
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
            ];
        };
        toptags: {
            tag: [
                {
                    name: string;
                    url: string;
                },
            ];
        };
    };
};
