const concerts = require("../models/concerts");
const concertsService = require("../services/concerts")
const { getArtistLatestAlbum } = require('../services/spotifyService');
const multer = require("multer");
const mongoose = require('mongoose'); //for needed type convert 
const facebookService = require('../services/facebookService');

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({ storage: storage });


const showAllConcerts = async (req, res) => {
    let concerts = await concertsService.getConcerts();
    
    // Convert Buffer to Base64 for each concert
    concerts = concerts.map(concert => {
        return {
            ...concert._doc,
            picture: concert.picture ? concert.picture.toString('base64') : null // Handle missing images
        };
    });

    return res.json(concerts);
};

const showLatestAlbum = async (req, res) => {
    try {
        const artistName = req.body.artist_name || req.params.artistName;
        const latestAlbum = await getArtistLatestAlbum(artistName);

        if (!latestAlbum) {
            return res.status(404).json({ message: 'No album found for this artist.' });
        }

        // Send JSON response with album details
        res.json(latestAlbum);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving latest album.' });
    }
};


const createConcert = async (req, res) => {

    const picture = req.file ? req.file.buffer : null; // Access the uploaded file buffer

    const { door_opening, hour, ticket_amount, date, artist_name, location, price } = req.body;
    try {
         // Validate door opening hour
         const openDoorsValid = await concertsService.checkOpeningDoors(door_opening, hour);
         if (!openDoorsValid) {
            return res.status(400).json({ message: 'The Door opening hour cannot be after the concert begins.' });
         }

          // Validate the concert's date
          const dateValid = await concertsService.checkConcertDate(date);
          if (!dateValid) {
             return res.status(400).json({ message: 'You can only add concerts starting from tomorrow' });
          }
          
          // Validate the ticket amount
          const ticketAmountValid = await concertsService.checkTicketAmount(ticket_amount);
          if (!ticketAmountValid) {
             return res.status(400).json({ message: 'The minimum of the ticket amount is 1.' });
          }

          // Validate the price
          const priceValid = await concertsService.checkPrice(price);
          if (!priceValid) {
             return res.status(400).json({ message: 'Minimum price is 1 Shekels.' });
          }

          // Validate whether there is another concert by the same artist in this date
          const ExisitingConcertArtistValid = await concertsService.checkExisitingConcertArtist(artist_name, date);
          if (!ExisitingConcertArtistValid) {
             return res.status(400).json({ message: 'There is another concert by this artist in this date.' });
          }

          // Validate whether there is another concert in the same location, date and hour
          const ExisitingConcertLocationValid = await concertsService.checkExisitingConcertLocation(hour, date, location);
          if (!ExisitingConcertLocationValid) {
             return res.status(400).json({ message: 'There is another concert in the same location, date and hour.' });
          }


        const newConcert = await concertsService.createConcert(req.body.artist_name,
                                                               req.body.date,
                                                               req.body.hour,
                                                               req.body.door_opening,
                                                               req.body.location,
                                                               req.body.ticket_amount,
                                                               req.body.ticket_amount, // Create the tickets_available from the ticket_amount
                                                               req.body.price,
                                                               picture
        );
        res.redirect("/admin.html");
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const editConcert = async (req, res) => {
    const { door_opening, hour, ticket_amount , date, artist_name, location, price} = req.body;
    const pictureBuffer = req.file ? req.file.buffer : null
    try {
         // Validate door opening hour
         const openDoorsValid = await concertsService.checkOpeningDoors(door_opening, hour);
         if (!openDoorsValid) {
            return res.status(400).json({ message: 'The Door opening hour cannot be after the concert begins.' });
         }

          // Validate the concert's date
          const dateValid = await concertsService.checkConcertDate(date);
          if (!dateValid) {
             return res.status(400).json({ message: 'You can only add concerts starting from tomorrow.' });
          }

          // Validate the ticket amount
          const ticketAmountValid = await concertsService.checkTicketAmount(ticket_amount);
          if (!ticketAmountValid) {
             return res.status(400).json({ message: 'The minimum of the ticket amount is 1.' });
          }

          // Validate the price
          const priceValid = await concertsService.checkPrice(price);
          if (!priceValid) {
             return res.status(400).json({ message: 'Minimum price is 1 Shekels.' });
          }

        const updatedConcert = await concertsService.editConcert(req.params.id,
                                                                 req.body.artist_name,
                                                                 req.body.date,
                                                                 req.body.hour,
                                                                 req.body.door_opening,
                                                                 req.body.location,
                                                                 req.body.ticket_amount,
                                                                 req.body.price,
                                                                 pictureBuffer // Pass the updated image buffer
        );
        res.redirect("/admin.html");
    }
    catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getConcert(req, res) {
    let concertId = req.params.id// concertId may be a string or objectID type
    if (typeof concertId === 'string') {
        //if it was a string, converting to objectID
        concertId = new mongoose.Types.ObjectId(concertId);
      }
    concert = await concertsService.getConcert(concertId);
    return res.json(concert);
}

async function deleteConcert(req, res) {
    const concertId = req.params.id

    try {
        await concertsService.deleteConcert(concertId);
        res.status(200).send("added successfully");

    } catch (error) {
        res.status(500).send("Error deleting concert: " + error.message);
    }
}

async function getFutureConcerts(req, res) {
    let concerts = await concertsService.getFutureConcerts();
    concerts = concerts.map(concert => {
        return {
            ...concert,
            picture: concert.picture ? concert.picture.toString('base64') : null // Handle missing images
        };
    });
    return res.json(concerts);
}

const editTicketsForConcert = async (req, res) => {
    const updatedTickets = await concertsService.editTicketsForConcert(req.params.id, req.body.tickets_available);
    
}

module.exports = {showAllConcerts, createConcert, deleteConcert, editConcert, getConcert, showLatestAlbum, editTicketsForConcert, getFutureConcerts}