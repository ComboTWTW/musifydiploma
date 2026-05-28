const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

export const getArtistTags = async (mbid: string): Promise<artitsTagsT> => {
    const link = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&${mbid}&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(link);
        const data: artitsTagsT = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export type artitsTagsT = {};
