const express = require("express");
const router = express.Router()
const concertsController = require("../controllers/concerts")

router.route("/").get(concertsController.showAllConcerts)
router.route("/concert/:id").delete(concertsController.deleteConcert).post(concertsController.editConcert).get(concertsController.getConcert).get(concertsController.showLatestAlbum);
router.route("/addconcert").post((req, res) => {
    concertsController.createConcert(req, res)
})
router.route("/artist/:artistName/latest-album").get(concertsController.showLatestAlbum);

module.exports = router;