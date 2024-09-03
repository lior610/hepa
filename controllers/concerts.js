const concertsService = require("../services/concerts")
const latestAlbumView = require('../public/scripts/latestAlbumView');
const { getArtistLatestAlbum } = require('../services/spotifyService');

const showAllConcerts = async (req, res) => {
    concerts = await concertsService.getConcerts();
    return res.json(concerts);
}

const showLatestAlbum = async (req, res) => {
    try {
        const artistName = req.body.artist_name || req.params.artistName;
        const latestAlbum = await getArtistLatestAlbum(artistName);

        if (!latestAlbum) {
            return res.status(404).send('No album found for this artist.');
        }

        // Render the HTML using the view
        const albumHtml = latestAlbumView(latestAlbum);
        res.send(albumHtml);
    } catch (error) {
        res.status(500).send('Error retrieving latest album.');
    }
};

const createConcert = async (req, res) => {
    const newConcert = await concertsService.createConcert({
        artist_name: req.body.artist_name,
        date: req.body.date,
        hour: req.body.hour,
        door_opening: req.body.door_opening,
        location: req.body.location,
        ticket_amount: req.body.ticket_amount,
        picture: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)) // Read the uploaded image file
        })
    res.redirect("/")
}

const editConcert = async (req, res) => {
    const updatedConcert = await concertsService.editConcert(req.params.id,
                                                  req.body. artist_name,
                                                  req.body.date,
                                                  req.body.hour,
                                                  req.body.door_opening,
                                                  req.body.location,
                                                  req.body.ticket_amount,
                                                  req.body.picture
                                                )
    res.redirect("/") //redirect every func to rellevat page 
}

async function getConcert(req, res) {
    const concertId = req.params.id
    concert = await concertsService.getConcert(concertId);
    return res.json(concert);
}

async function deleteConcert(req, res) {
    const concertId = req.params.id

    try {
        await concertsService.deleteConcert(concertId);
        res.status(200).send("added successfully");
    } catch (error) {
        res.status(500).send("Error deleting concert: " + error.message);
    }
}

module.exports = {showAllConcerts, createConcert, deleteConcert, editConcert, getConcert, showLatestAlbum}