// Function to fetch concert details
function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    return $.ajax({
        url: `/api_concerts/concert/${id}`,
        method: "GET",
        dataType: "json"
    })
    .then(data => data[0]) // Return the first element of the data array
    .catch(error => {
        console.error("Error fetching concert:", error);
        return null;
    });
}

// Function to fetch the latest album based on the artist name
function getLatestAlbum(artistName) {
    return $.ajax({
        url: `/api_concerts/artist/${artistName}/latest-album`,
        method: "GET",
        dataType: "json"
    })
    .then(data => data) // Return the album data
    .catch(error => {
        console.error("Error fetching album:", error);
        return null;
    });
}

function showConcert() {
    getConcert().then(concertData => {
        if (concertData) {
            document.getElementById("artist_name").textContent = concertData.artist_name;
            document.getElementById("date").textContent = concertData.date;
            document.getElementById("hour").textContent = concertData.hour;
            document.getElementById("door_opening").textContent = concertData.door_opening;
            document.getElementById("location").textContent = concertData.location;
            document.getElementById("location").textContent = concertData.location;
            document.getElementById("price").textContent = concertData.location;


            // Fetch the latest album using the artist name
            getLatestAlbum(concertData.artist_name).then(albumData => {
                if (albumData) {
                    displayAlbumInfo(albumData);
                }
            });
        }
    });
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
        albumHeading.classList.add("album-heading"); // Add a specific class for styling
    }
}

// Execute the showConcert function when the page loads
showConcert();
