// Function to generate HTML for the latest album view
const latestAlbumView = (album) => {
    return `
        <div style="text-align: center;">
            <h2>Haven't heard <i>${album.name}</i> yet?</h2>
            <a href="${album.external_urls.spotify}" target="_blank">
                <img src="${album.images[0].url}" alt="Album cover" style="width:300px;height:300px;cursor:pointer;">
            </a>
        </div>
    `;
};

module.exports = latestAlbumView;
