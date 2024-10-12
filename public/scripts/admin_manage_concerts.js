// Initialize variables
let currentConcertIndex = 0;
let concertsPerLoad = 8;
let allConcerts = []; // Store all concerts for loading
let closestConcerts = [];

// Show/Hide 'Load More' button
function showLoadMoreButton() {
    $('#load-more').show();
}

function hideLoadMoreButton() {
    $('#load-more').hide();
}

// Load concerts initially and for "Load More" button
function loadConcerts() {
    const $concertsContainer = $('#concertList'); // Use jQuery to select the element
    const searchQuery = $('#search-input').val().trim(); // Search bar input

    // AJAX call to get all concerts
    $.ajax({
        url: '/api_concerts',
        method: 'GET',
        success: function(allConcerts) {
            let filteredConcerts = allConcerts;

            // Apply search filter
            if (searchQuery !== "") {
                filteredConcerts = searchByName(allConcerts, searchQuery);
            }

            // Clear previous content when starting a new search or loading for the first time
            if (currentConcertIndex === 0) {
                $concertsContainer.empty();
            }

            // Get the next batch of concerts based on currentConcertIndex and concertsPerLoad
            const nextConcerts = filteredConcerts.slice(currentConcertIndex, currentConcertIndex + concertsPerLoad);

            // Loop through the next batch of concerts and display them
            nextConcerts.forEach(concert => {
                const card = createConcertCard(concert); // Function to create the card HTML
                $concertsContainer.append(card); // Append to the container
            });

            // Update the current concert index for the next load
            currentConcertIndex += concertsPerLoad;

            // Show or hide "Load More" button based on whether there are more concerts to load
            if (currentConcertIndex >= filteredConcerts.length) {
                hideLoadMoreButton();
            } else {
                showLoadMoreButton();
            }
        },
        error: function() {
            alert('Failed to load concerts.');
        }
    });
}

// Load more concerts when "Load More" button is clicked
function loadMoreConcerts() {
    loadConcerts(); // Call loadConcerts to load the next batch
}


// Function to create the concert card
function createConcertCard(concert) {
    const card = $('<div>').addClass('concert-card')
                           .attr('data-concert-id', concert._id); // Attach the concert ID to the card
    
    // Create image element
    const imgContainer = $('<div>').addClass('concert-image');
    const img = $('<img>').attr('src', `data:image/jpeg;base64,${concert.picture}`)
                          .attr('alt', `${concert.artist_name} Concert`);
    imgContainer.append(img);

    // Create content element
    const content = $('<div>').addClass('concert-content')
                              .html(`
                                  <h3>${concert.artist_name}</h3>
                                  <p>Date: ${concert.date}</p>
                                  <p>Time: ${concert.hour}</p>
                                  <p>Doors Open: ${concert.door_opening}</p>
                                  <p>Location: ${concert.location}</p>
                                  <p>Ticket Price: ${concert.price}</p>
                                  <p>Tickets Available: ${concert.tickets_available} / ${concert.ticket_amount}</p>
                              `);

    // Create actions container for buttons
    const actionsContainer = $('<div>').addClass('concert-actions');
    
    // Create Edit button
    const editButton = $('<a>').addClass('btn btn-outline-primary btn-edit')
                               .text('Edit')
                               .data('concert-id', concert._id); // Store concert ID in the button's data attribute
    
    // Create Remove button
    const removeButton = $('<button>').addClass('btn btn-outline-danger bi bi-trash3')
                                      .text('Remove')
                                      .data('concert-id', concert._id); // Store concert ID in the button's data attribute

    // Append buttons to actions container
    actionsContainer.append(editButton);
    actionsContainer.append(removeButton);

    // Append image, content, and actions to the card
    card.append(imgContainer);
    card.append(content);
    card.append(actionsContainer);

    return card; // Return the constructed card
}

loadConcerts()

// Event delegation for dynamic buttons
$(document).on('click', '.btn-edit', function() {
    const concertId = $(this).data('concert-id'); // Get concert ID from button's data attribute
    editConcert(concertId); // Call the edit function
});

$(document).on('click', '.btn-outline-danger', function() {
    const concertId = $(this).data('concert-id'); // Get concert ID from button's data attribute
    removeConcert(concertId); // Call the remove function
});

function removeConcert(concertId) {
    $.ajax({
        url: `/api_concerts/concert/${concertId}`,
        type: 'DELETE',
        success: function(response) {
            // Successfully removed the concert
            alert("Concert removed successfully.");
            
            // Use a more robust selector to ensure the card is removed
            const concertCard = $(`.concert-card[data-concert-id='${concertId}']`);
            
            if (concertCard.length) {
                concertCard.remove(); // Remove the concert card from the UI
            } else {
                console.warn(`Concert card with ID ${concertId} not found.`);
            }
        },
        error: function(xhr, status, error) {
            // Handle error if removal was not successful
            alert("Failed to remove concert: " + error);
        }
    });
}



async function editConcert(id) {   
    window.location.href = `/edit_concert.html?id=${id}`
}

// working with graph #1
function renderChart() {
    $.ajax({
        url: '/api_concerts/api_concerts_chart', // Updated URL
        method: 'GET',
        success: function(chartData) {
            const labels = chartData.map(concert => concert.artist_name); // Only artist names
            const ticketsSoldPercentage = chartData.map(concert => concert.ticketSoldPercentage);

            const ctx = document.getElementById('Chart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Tickets Sold (%)',
                        data: ticketsSoldPercentage,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        },
        error: function() {
            alert('Failed to load chart data.');
        }
    });
}

renderChart();

//filter function , gets an arr of concerts , return filtered arr
function searchByName(concerts, searchQuery) {
    const filteredResults = concerts.filter(e => {
        const lowerCase = searchQuery.toLowerCase();
        return e.artist_name.toLowerCase().includes(lowerCase);
    })

    return filteredResults
}
