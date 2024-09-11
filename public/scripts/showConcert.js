// Function to fetch concert details
async function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    try {
        const response = await fetch(`/api/concert/${id}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching concert:", error);
        return null;
    }
}

// Function to fetch the latest album based on the artist name
async function getLatestAlbum(artistName) {
    try {
        const response = await fetch(`/artist/${artistName}/latest-album`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Assuming data is an object
    } catch (error) {
        console.error("Error fetching album:", error);
        return null;
    }
}

async function showConcert() {
    const concertData = await getConcert();
    const albumData = await getLatestAlbum(concertData.artist_name);

    if (concertData) {
        document.getElementById("artist_name").textContent = concertData.artist_name;
        document.getElementById("date").textContent = concertData.date;
        document.getElementById("hour").textContent = concertData.hour;
        document.getElementById("door_opening").textContent = concertData.door_opening;
        document.getElementById("location").textContent = concertData.location;

        const albumData = await getLatestAlbum(concertData.artist_name);
        if (albumData) {
            displayAlbumInfo(albumData);
        }
    }
}

// Function to update HTML with album info
function displayAlbumInfo(album) {
    const albumHeading = document.getElementById("album-heading");
    const albumLink = document.getElementById("album-link");
    const albumCover = document.getElementById("album-cover");

    if (albumHeading && albumLink && albumCover) {
        albumHeading.textContent = `Haven't heard ${album.name} yet?`;
        albumLink.href = album.external_urls.spotify;
        albumCover.src = album.images[0].url;
    }
}

// Execute the showConcert function when the page loads
showConcert();
