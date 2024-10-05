const Concert = require("../models/concerts")
// services/spotifyService.js
const axios = require('axios');
const qs = require('qs');

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
    //add here update of ticketsd available
}

const getConcert = async(id) => {
    let concerts = await Concert.find({"_id": id})
    return concerts;
}

const getConcertByartistAndDate = async(artist_name, date) => {
    let concerts = await Concert.find({"artist_name": artist_name, "date": date})
    return concerts;
}

const getConcertByLocationDateTime = async(hour, date, location) => {
    let concerts = await Concert.find({"hour": hour, "date": date, "location": location})
    return concerts;
}

async function checkOpeningDoors(door_opening, hour) {
    // Convert both times to minutes since midnight
    const timeToMinutes = time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Compare the times
    return timeToMinutes(door_opening) < timeToMinutes(hour);
}

async function checkConcertDate(date) {
    const providedDate = new Date(date); // Convert the provided date string to a Date object
    const currentDate = new Date(); // Get the current date and time
    // Check if the provided date is before the current date
    return providedDate > currentDate;
}

async function checkTicketAmount(ticket_amount) {
    return (ticket_amount > 1);
}

async function checkExisitingConcertArtist(artist_name, date) {
    arr = await getConcertByartistAndDate(artist_name, date);
    if (Array.isArray(arr) && arr.length === 0)
    {
        return true;
    }
    return false;
}

async function checkExisitingConcertArtistEdit(artist_name, date) {
    //In edit we expect to see 1 concert only with these details
    arr = await getConcertByartistAndDate(artist_name, date);
    console.log(arr);
    if (Array.isArray(arr) && arr.length === 0)
    {
        return true;
    }
    if (Array.isArray(arr) && arr.length === 1)
        {
            return true;
        }
    return false;
    //this does not work! i need to compare object id in edit because arr length 0 and 1 does not work
}

async function checkExisitingConcertLocation(hour, date, location) {
    arr = await getConcertByartistAndDate(hour, date, location);
    if (Array.isArray(arr) && arr.length === 0)
    {
        return true;
    }
    return false;
}

async function checkExisitingConcertLocationEdit(hour, date, location) {
    //In edit we expect to see 1 concert only with these details
    arr = await getConcertByartistAndDate(hour, date, location);
    console.log("location");
    console.log(arr);
    if (Array.isArray(arr) && arr.length == 0)
    {
        return true;
    }
    return false;
    //this does not work! i need to compare object id in edit because arr length 0 and 1 does not work
}

module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert,
    getConcertByartistAndDate,
    getConcertByLocationDateTime,
    checkOpeningDoors,
    checkConcertDate,
    checkTicketAmount,
    checkExisitingConcertArtist,
    checkExisitingConcertLocation,
    checkExisitingConcertArtistEdit,
    checkExisitingConcertLocationEdit
};