const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSearchArtist = async (
    searchQuery: string,
): Promise<SearchArtistT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchQuery}&api_key=${apiKey}&format=json&autocorrect=1`;

    try {
        const res = await fetch(link);
        const data: SearchArtistT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type SearchArtistT = {
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
        artistmatches: {
            artist: Array<{
                name: string;
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
            }>;
        };
        "@attr": {
            for: string;
        };
    };
};
