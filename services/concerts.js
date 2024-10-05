const Concert = require("../models/concerts")
// services/spotifyService.js
const axios = require('axios');
const qs = require('qs');
 
const showAllConcerts = async (req, res) => {
    concerts = await concertsService.getConcerts();
    return res.json(concerts);
}

const createConcert = async (artist_name, date, hour,
    door_opening, location, ticket_amount, tickets_available, picture) => {
        const concert = new Concert({
            artist_name, date, hour, door_opening, location, ticket_amount, tickets_available, picture
        });

        let concertCreated = await concert.save();
        return concertCreated;
}

const getConcerts = async () => {
    return await Concert.find({})
}

const deleteConcert = async (id) => {
    return await Concert.deleteOne({"_id": id});
}

const editConcert = async (id, artist_name, date, hour, door_opening, 
    location, ticket_amount, picture) => {
    const data = {artist_name, date, hour, door_opening, 
        location, ticket_amount, picture}
    return await Concert.updateOne({"_id": id}, data)
}

const getConcert = async(id) => {
    let concerts = await Concert.find({"_id": id})
    return concerts;
}
const editTicketsForConcert = async (id,tickets_available) => {
    return await Concert.updateOne({"_id": id}, tickets_available)
}

module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert,
    editTicketsForConcert
};