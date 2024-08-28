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

const deleteConcert = async (userId) => {
    return await Concert.deleteOne({"_id": userId});
}

const editConcert = async (userId, full_name, username, password,
    mail, phone, address, gender, kind) => {
    const data = {full_name, username, password,
        mail, phone, address, gender, kind}
    return await Concert.updateOne({"_id": userId}, data)
}

const getConcert = async(userId) => {
    let concerts = await Concert.find({"_id": userId})
    return concerts;
}

module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert
};