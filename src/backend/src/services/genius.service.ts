import axios from "axios";
import * as cheerio from "cheerio";
import he from "he";

const geniusApiKey = process.env.GENIUS_API_KEY;

export const searchSongAndGetLyrics = async (searchQuery: string) => {
    // Search song
    const searchResponse = await axios.get("https://api.genius.com/search", {
        params: {
            q: searchQuery,
            access_token: process.env.GENIUS_API_KEY,
        },
    });

    //  Get first result
    const firstHit = searchResponse.data.response.hits[0];

    if (!firstHit) {
        throw new Error("Song not found");
    }

    const songUrl = firstHit.result.url;

    //  Fetch Genius HTML page
    const pageResponse = await axios.get(songUrl);

    const html = pageResponse.data;

    //  Parse HTML

    const $ = cheerio.load(html);

    const lyricsBlocks: string[] = [];

    $('[data-lyrics-container="true"]').each((i, el) => {
        const block = $(el).html();

        if (block) {
            lyricsBlocks.push(block);
        }
    });

    let lyrics = lyricsBlocks.join("\n");

    lyrics = lyrics.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");

    lyrics = he.decode(lyrics);

    lyrics = lyrics
        .replace(/Embed$/g, "")
        .replace(/You might also like/g, "")
        .replace(/\d+ Contributors/g, "")
        .replace(/Translations.+?Lyrics/g, "")
        .replace(/See .*? LiveGet tickets as low as \$\d+/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const firstLyricsIndex = lyrics.search(/\[(.*?)\]/);

    if (firstLyricsIndex !== -1) {
        lyrics = lyrics.slice(firstLyricsIndex);
    }
    return {
        title: firstHit.result.full_title,
        url: songUrl,
        lyrics,
    };
};
