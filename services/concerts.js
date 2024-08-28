const Concert = require("../models/concerts")

const createConcert = async (full_name, username, password,
    mail, phone, address, gender) => {
        const concert = new Concert({
            id, artist_name, date, hour, door_opening, location, ticket_amout, picture
        });

        return await conecrt.save();
}

const getConcerts = async () => {
    let concerts = await Concert.find({})
    return concerts;
}

const deleteConcert = async (id) => {
    return await Concert.deleteOne({"_id": id});
}

const editConcert = async (id, artist_name, date, hour, door_opening, 
    location, ticket_amout, picture) => {
    const data = {artist_name, date, hour, door_opening, 
        location, ticket_amout, picture}
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