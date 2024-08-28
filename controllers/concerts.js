const concertsService = require("../services/concerts")

const showAllConcerts = async (req, res) => {
    concerts = await concertsService.getConcerts();
    return res.json(concerts);
}

const createConcert = async (req, res) => {
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    const newConcert = await concertsService.createConcert(req.body.full_name,
                                                  req.body.username,
                                                  req.body.password,
                                                  req.body.mail,
                                                  req.body.phone,
                                                  address,
                                                  req.body.gender,
                                                )
    res.redirect("/")
}

const editConcert = async (req, res) => {
    const address = {
        number: req.body.address_number,
        street: req.body.address_street,
        city: req.body.address_city
    }
    const updatedConcert = await concertsService.editConcert(req.params.id,
                                                  req.body.full_name,
                                                  req.body.username,
                                                  req.body.password,
                                                  req.body.mail,
                                                  req.body.phone,
                                                  address,
                                                  req.body.gender,
                                                  req.body.kind
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