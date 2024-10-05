const concertsService = require("../services/concerts")
const { getArtistLatestAlbum } = require('../services/spotifyService');
const multer = require("multer");
const facebookService = require('../services/facebookService.js');

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({ storage: storage });


const showAllConcerts = async (req, res) => {
    let concerts = await concertsService.getConcerts();
    
    // Convert Buffer to Base64 for each concert
    concerts = concerts.map(concert => {
        return {
            ...concert._doc,
            picture: concert.picture ? concert.picture.toString('base64') : null // Handle missing images
        };
    });

    return res.json(concerts);
};

const showLatestAlbum = async (req, res) => {
    try {
        const artistName = req.body.artist_name || req.params.artistName;
        const latestAlbum = await getArtistLatestAlbum(artistName);

        if (!latestAlbum) {
            return res.status(404).json({ message: 'No album found for this artist.' });
        }

        // Send JSON response with album details
        res.json(latestAlbum);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving latest album.' });
    }
};


const createConcert = async (req, res) => {
    const picture = req.file ? req.file.buffer : null; // Access the uploaded file buffer
    console.log("picture from form: " + picture)

    const newConcert = await concertsService.createConcert(req.body.artist_name,
                                                           req.body.date,
                                                           req.body.hour,
                                                           req.body.door_opening,
                                                           req.body.location,
                                                           req.body.ticket_amount,
                                                           req.body.ticket_amount, // Create the tickets_available from the ticket_amount
                                                           picture
    );
     // Post the concert details to Facebook
     if (req.body.publish_on_facebook) {
        await facebookService.postToFacebook(newConcert);
     }
        res.redirect("/admin.html");
}

const editConcert = async (req, res) => {
    const pictureBuffer = req.file ? req.file.buffer : null;
    const updatedConcert = await concertsService.editConcert(req.params.id,
                                                             req.body.artist_name,
                                                             req.body.date,
                                                             req.body.hour,
                                                             req.body.door_opening,
                                                             req.body.location,
                                                             req.body.ticket_amount,
                                                             pictureBuffer // Pass the updated image buffer
    );
    res.redirect("/admin.html");
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