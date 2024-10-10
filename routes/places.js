const express = require("express");
const router = express.Router()
const placesController = require("../controllers/places")

router.route("/").get(placesController.showAllPlaces)
router.route("/place/:id").delete(placesController.deletePlace).post(placesController.editPlace).get(placesController.getPlace)
router.route("/addplace").post((req, res) => {
    placesController.createPlace(req, res)
})
router.route("/concert-locations").get(placesController.getLocations);
module.exports = router;

