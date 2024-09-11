const Concert = require("../models/concerts")

const createConcert = async (artist_name, date, hour,
    door_opening, location, ticket_amount, picture) => {
        const concert = new Concert({
            artist_name, date, hour, door_opening, location, ticket_amount, picture
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

module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert
};