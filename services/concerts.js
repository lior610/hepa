const Concert = require("../models/concerts")
// services/spotifyService.js
const axios = require('axios');
const qs = require('qs');

const createConcert = async (artist_name, date, hour,
    door_opening, location, ticket_amount, tickets_available, price, picture) => {
        const concert = new Concert({
            artist_name, date, hour, door_opening, location, ticket_amount, tickets_available, price, picture
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

const editConcert = async (id, artist_name, date, hour, door_opening, location, ticket_amount, tickets_available, price, picture) => {
    let data = { artist_name, date, hour, door_opening, location, ticket_amount, tickets_available, price };
    if (picture != null) {
        data.picture = picture; // Add picture if available
    }
    return await Concert.updateOne({ "_id": id }, data); // Update the concert
};


const getConcert = async(id) => {
    let concerts = await Concert.find({"_id": id})
    return concerts;
}
const editTicketsForConcert = async (id,tickets_available) => {
    return await Concert.updateOne({"_id": id} ,{$set: { tickets_available }})
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
    return (ticket_amount >= 1);
}

async function checkPrice(price) {
    return (price >= 1);
}

async function checkExisitingConcertArtist(artist_name, date) {
    arr = await getConcertByartistAndDate(artist_name, date);
    if (Array.isArray(arr) && arr.length === 0)
    {
        return true;
    }
    return false;
}

async function checkExisitingConcertLocation(hour, date, location) {
    arr = await getConcertByLocationDateTime(hour, date, location);
    if (Array.isArray(arr) && arr.length === 0)
    {
        return true;
    }
    return false;
}

async function checkAvailableTickets(id, ticket_amount) {
    let concert = await Concert.find({"_id": id})
    let soldTickets = (concert[0].ticket_amount - concert[0].tickets_available)
    let newAvailTickets = concert[0].tickets_available + (ticket_amount - concert[0].ticket_amount)
    return [soldTickets <= ticket_amount, newAvailTickets];
}

const getFutureConcerts = async() => {
    let concerts = await Concert.aggregate([
        {
            $addFields: {
                dateObj: { $dateFromString: { dateString: "$date" } }
            }
        },
        {
            $match: {
                dateObj: { $gte: new Date() }
            }
        }
    ]);
    return concerts;
}

const getTicketSoldPercentage= async () => {
        const result = await Concert.aggregate([
            {
                $group: {
                    _id: "$artist_name", // Group by artist name
                    totalTicketsSold: {
                        $sum: { 
                            $subtract: ["$ticket_amount", "$tickets_available"] // Calculate tickets sold
                        }
                    },
                    totalTicketsAmount: { $sum: "$ticket_amount" } // Calculate total tickets
                }
            },
            {
                $project: {
                    artist_name: "$_id", // Rename _id to artist_name
                    _id: 0, // Exclude _id from the result
                    ticketSoldPercentage: {
                        $multiply: [
                            { $divide: ["$totalTicketsSold", "$totalTicketsAmount"] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { ticketSoldPercentage: -1 } // Sort by tickets sold percentage in descending order
            },
            {
                $limit: 10 // Limit to top 10 artists
            }
        ]);
    
        return result;
    };
    


module.exports = {
    createConcert,
    getConcerts,
    deleteConcert,
    editConcert,
    getConcert,
    editTicketsForConcert,
    getConcertByartistAndDate,
    getConcertByLocationDateTime,
    checkOpeningDoors,
    checkConcertDate,
    checkTicketAmount,
    checkPrice,
    checkExisitingConcertArtist,
    checkExisitingConcertLocation,
    checkAvailableTickets,
    getFutureConcerts,
    getTicketSoldPercentage
};
