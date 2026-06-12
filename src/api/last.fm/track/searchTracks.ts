const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSearchTracks = async (
    searchQuery: string,
): Promise<SearchTrackT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchQuery}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: SearchTrackT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type SearchTrackT = {
    results: {
        "opensearch:Query": {
            "#text": string;
            role: string;
            searchTerms: string;
            startPage: string;
        };
        "opensearch:totalResults": string;
        "opensearch:startIndex": string;
        "opensearch:itemsPerPage": string;
        trackmatches: {
            track: [
                {
                    name: string;
                    artist: string;
                    url: string;
                    streamable: string;
                    listeners: string;
                    image: [
                        {
                            "#text": string;
                            size: "small";
                        },
                        {
                            "#text": string;
                            size: "medium";
                        },
                        {
                            "#text": string;
                            size: "large";
                        },
                        {
                            "#text": string;
                            size: "extralarge";
                        },
                    ];
                    mbid: string;
                },
            ];
        };
        "@attr": {
            for: string;
        };
    };
};
