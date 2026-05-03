const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getArtistInfo = async (mbid: string): Promise<ArtistInfoT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${mbid}&api_key=${apiKey}&autocorrect=1&format=json`;

    try {
        const res = await fetch(link);
        const data: ArtistInfoT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type ArtistInfoT = {
    artist: {
        name: string;
        mbid: string;
        url: string;
        image: [
            {
                "#text": string;
                size: string;
            },
        ];
        streamable: string;
        ontour: string;
        stats: {
            listeners: string;
            playcount: string;
        };
        similar: {
            artist: [
                {
                    name: string;
                    url: string;
                    image: [
                        {
                            "#text": string;
                            size: string;
                        },
                    ];
                },
            ];
        };
        tags: {
            tag: [
                {
                    name: string;
                    url: string;
                },
            ];
        };
        bio: {
            links: {
                link: {
                    "#text": string;
                    rel: string;
                    href: string;
                };
            };
            published: string;
            summary: string;
            content: string;
        };
    };
};
