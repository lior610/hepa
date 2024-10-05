const axios = require('axios');

// Facebook Page Access Token
const PAGE_ACCESS_TOKEN = 'EAAUwwfkxdwEBOwatBncdOrvwM0zlb2xt8FB5PyWIcHikF5GvpkRMl75ZAjFcSzk8JwuAm8DbcFWbvrq6ySWiSa8F16OhVVfz0Khklw3Uox8kybmvX8oyKLd0QNiNZAtENxBKo5RAVZApZA2b4iPyJYmThVRPQjmw6Oi1ZCzvdtceKjctG2LNn3j3ijb454j3C';
const PAGE_ID = '475819745603692';  // The actual Page ID

// Function to post a concert to Facebook
const postToFacebook = async (concert) => {
    try {
        // Facebook Graph API URL for posting to page's feed
        const url = `https://graph.facebook.com/${PAGE_ID}/feed?access_token=${PAGE_ACCESS_TOKEN}`;

        // Prepare the Facebook post message
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

        // Send a POST request to the Facebook Graph API
        const response = await axios.post(url, {
            message: message
        });

        // Log the successful post response
        console.log("Posted to Facebook:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error posting to Facebook:", error.response ? error.response.data : error.message);
        throw new Error("Failed to post to Facebook");
    }
};
module.exports = { postToFacebook };
