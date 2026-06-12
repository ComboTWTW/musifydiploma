const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getSearchAlbum = async (
    searchQuery: string,
): Promise<SearchAlbumT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchQuery}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: SearchAlbumT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type SearchAlbumT = {
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
        albummatches: {
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
            }[];
        };
    };
};
