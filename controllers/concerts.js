const concertsService = require("../services/concerts")

const showAllConcerts = async (req, res) => {
    concerts = await concertsService.getConcerts();
    return res.json(concerts);
}

const createConcert = async (req, res) => {
    const newConcert = await concertsService.createConcert(req.body.artist_name,
                                                           req.body.date,
                                                           req.body.hour,
                                                           req.body.door_opening,
                                                           req.body.location,
                                                           req.body.ticket_amount,
                                                           req.body.picture
                                                           //fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)) // Read the uploaded image file
        )
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
module.exports = {showAllConcerts, createConcert, deleteConcert, editConcert, getConcert}