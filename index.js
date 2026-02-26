#!/usr/bin/env node

/**
 * Usage:
 * node index.js https://example.com/videos/123/title/
 */

async function extractVideoMetadata(pageUrl) {

    if (!pageUrl) {
        throw new Error("URL required");
    }

    // parse URL
    const url = new URL(pageUrl);

    // ambil domain utama
    const hostParts = url.hostname.split(".");
    const domain = hostParts[hostParts.length - 2];

    // ambil video ID dari URL
    let videoId = null;

    const match = pageUrl.match(/\/videos\/(\d+)\//);

    if (match) {
        videoId = match[1];
       console.log(videoId);
    }

    if (!videoId) {
        throw new Error("Video ID not found in URL");
    }

    // API URL
    const apiUrl = `https://transpiria.com/api/${domain}/videos/${videoId}`;

    // fetch API
    const response = await fetch(apiUrl, {
        headers: {
            "accept": "application/json",
            "user-agent": "Mozilla/5.0"
        }
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const json = await response.json();

    return json;
}


// CLI runner
async function main() {

    const inputUrl = process.argv[2];

    if (!inputUrl) {

        console.log("Usage:");
        console.log("node index.js <VIDEO_PAGE_URL>");
        process.exit(1);

    }

    try {

        const data = await extractVideoMetadata(inputUrl);

        // print full API response
        console.log(JSON.stringify(data, null, 2));

        console.log(data.resolvedVideoUrl);
        console.log(data.title);

    }
    catch (err) {

        console.error("Error:", err.message);

    }

}

main();
