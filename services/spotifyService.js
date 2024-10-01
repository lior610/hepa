const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '../config/.env.local') });
const axios = require('axios');
const qs = require('qs');

// Spotify credentials
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

//Get an access token
const getAuth = async () => {
    try {
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({ 'grant_type': 'client_credentials' });

        const response = await axios.post(token_url, data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting auth token:', error.response?.data || error.message);
        throw error;
    }
};

//Search for an artist id by name
const searchArtistByName = async (artistName) => {
    try {
        // Get the access token
        const token = await getAuth(); 
        const searchUrl = `https://api.spotify.com/v1/search`;

        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                q: artistName,
                type: 'artist',
                limit: 1
            }
        });

        const artist = response.data.artists.items[0];
        if (!artist) {
            throw new Error('Artist not found');
        }

        return artist.id;
    } catch (error) {
        console.error('Error searching for artist:', error.response?.data || error.message);
        throw error;
    }
};

// Get the latest album of an artist
const getArtistLatestAlbum = async (artistName) => {
    try {
        // Find artist ID by name
        const artistId = await searchArtistByName(artistName); 
        // Get the access token
        const token = await getAuth(); 

        const albumResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                limit: 1,
                album_type: 'album',
            }
        });

        if (albumResponse.status === 404 || albumResponse.data.items.length === 0) {
            throw new Error('No albums found for this artist.');
        }

        return albumResponse.data.items[0];
    } catch (error) {
        console.error('Error fetching artist latest album:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = { getArtistLatestAlbum };
