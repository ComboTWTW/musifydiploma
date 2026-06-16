const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const getLyricsAnalysis = async (lyrics: string) => {
    // 1. Guard against missing environment variables
    if (!apiKey) {
        throw new Error(
            "VITE_GEMINI_API_KEY is not defined. Check your .env file and restart your Vite server.",
        );
    }

    // 2. Construct the URL cleanly
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `Объясни, пожалуйста, смысл и значение текста песни (ответ на русском). Ответ не более 60 слов, raw data:\n\n${lyrics}`,
                        },
                    ],
                },
            ],
        }),
    });

    if (!res.ok) {
        // Log the actual error text from Google to make debugging easier
        const errorText = await res.text();
        throw new Error(
            `Gemini request failed with status ${res.status}: ${errorText}`,
        );
    }

    return res.json();
};
