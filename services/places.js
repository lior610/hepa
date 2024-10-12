const Place = require("../models/places")
const axios = require('axios');
const qs = require('qs');

const createPlace = async (city, address, type) => {
        const place = new Place({
            _id: city, address, type
        });

        let placeCreated = await place.save();
        return placeCreated;
}

const getPlaces = async () => {
    return await Place.find({})
}

const deletePlace = async (id) => {
    return await Place.deleteOne({"_id": id});
}

const editPlace = async (id, city, address, type) => {
    const data = {city, address, type}
    return await Place.updateOne({"_id": id}, data)
}

const getPlace = async(id) => {
    let places = await Place.find({"_id": id})
    return places;
}

module.exports = {
    createPlace,
    getPlaces,
    deletePlace,
    editPlace,
    getPlace,
};