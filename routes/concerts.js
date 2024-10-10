const express = require("express");
const router = express.Router();
const concertsController = require("../controllers/concerts");
const multer = require("multer");

// Set up multer to store file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 
router.route("/")
    .get(concertsController.showAllConcerts);

router.route("/concert/:id") 
    .delete(concertsController.deleteConcert)
    .post(upload.single('picture'), concertsController.editConcert) // Handle image upload
    .get(concertsController.getConcert)

router.route("/concert/tickets/:id")
    .post(concertsController.editTicketsForConcert) // edit available tickets

router.route("/addconcert").post(upload.single('picture'), (req, res) => {
    concertsController.createConcert(req, res)});

router.route("/concert/:id/picture").get(async (req, res) => {
    const concert = await concertsController.getConcert(req, res);
    if (concert.picture) {
        res.set("Content-Type", "image/png");
        res.send(concert.picture);
    } else {
        res.status(404).send("Image not found");
    }
});

router.route("/future").get(concertsController.getFutureConcerts);

router.route("/artist/:artistName/latest-album").get(concertsController.showLatestAlbum);

module.exports = router;