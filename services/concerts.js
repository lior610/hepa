const Concert = require("../models/concerts")

const createConcert = async (full_name, username, password,
    mail, phone, address, gender) => {
        const concert = new Concert({
            id, artist_name, date, hour, door_opening, location, ticket_amount, picture
        });

        let concertCreated = await concert.save();
        fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename)); // Delete the temporary file
        res.send('Concert created and picture uploaded successfully');
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
    // res.send(concert[0].picture); // Send the picture buffer
    return concerts;
}

module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert
};