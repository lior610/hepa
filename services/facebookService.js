const axios = require('axios');
require('custom-env').env(process.env.NODE_ENV, "./config")

// Facebook Page Access Token
const page_at = process.env.PAGE_ACCESS_TOKEN;
const page_id = process.env.PAGE_ID;

// Function to post a concert to Facebook
const postToFacebook = async (concert) => {
    try {
        const url = `https://graph.facebook.com/${page_id}/feed?access_token=${page_at}`;

        const message = `
                🎶 A New Concert has been Added to our site! 🎶\n
            🎤 Artist: ${concert.artist_name}\n
            📅 Date: ${concert.date}\n
            🕒 Time: ${concert.hour}\n
            🚪 Door Opening: ${concert.door_opening}\n
            🌍 Location: ${concert.location}\n
            🎟️ Hurry to save your place!\n
            --- Now on our website ---
        `;

        const response = await axios.post(url, {
            message: message
        });

        return response.data;

    } catch (error) {
        console.error("Error posting to Facebook:", error.response ? error.response.data : error.message);
        throw new Error("Failed to post to Facebook");
    }
};
module.exports = { postToFacebook };
