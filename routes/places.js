const express = require("express");
const router = express.Router()
const placesController = require("../controllers/places")
const loginController = require("../controllers/login")

router.route("/").get(placesController.showAllPlaces)
router.route("/place/:id")
    .delete(loginController.isAdmin, placesController.deletePlace)
    .post(loginController.isAdmin, placesController.editPlace)
    .get(placesController.getPlace)

router.route("/addplace").post(loginController.isAdmin, (req, res) => {
    placesController.createPlace(req, res)
})
router.route("/concert-locations").get(placesController.getLocations);
module.exports = router;

