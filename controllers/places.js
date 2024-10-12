const placesService = require("../services/places")
const Place = require('../models/places');

const showAllPlaces = async (req, res) => {
    let places = await placesService.getPlaces();
    return res.json(places);
};


const createPlace = async (req, res) => {
    const newPlace = await placesService.createPlace(req.body.city,
                                                      req.body.address,
                                                      req.body.type
    );
    res.redirect("/admin.html");
}

const editPlace = async (req, res) => {
    const updatedPlace = await placesService.editPlace(req.params.id,
                                                             req.body.city,
                                                             req.body.address,
                                                             req.body.type
    );
    res.redirect("/admin.html");
}

async function getPlace(req, res) {
    const placeId = req.params.id
    place = await placesService.getPlace(placeId);
    return res.json(place);
}

async function deletePlace(req, res) {
    const placeId = req.params.id

    try {
        await placesService.deletePlace(placeId);
        res.status(200).send("removed successfully");

    } catch (error) {
        res.status(500).send("Error deleting place: " + error.message);
    }
}


const getLocations = async (req, res) => {
    try {
      const locations = await Place.find({}, 'city address');
      res.json(locations); 
    } catch (error) {
      console.error('Error fetching concert locations:', error);
      res.status(500).json({ error: 'Failed to fetch concert locations' });
    }
  };

module.exports = {showAllPlaces, createPlace, deletePlace, editPlace, getPlace, getLocations}