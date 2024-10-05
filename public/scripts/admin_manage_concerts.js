// Function to load FUTURE concerts 
async function loadConcerts() {
    const concertsContainer = document.getElementById("concertList");
    
    //const cartList = document.getElementById("shoppingCart");
    allConcerts = await fetchConcerts() //get all concerts

    //check if there is search filter
    const searchBar = document.getElementById("search-input"); //take the input user typed in search 
    const searchQuery = searchBar.value.trim();
    if(searchQuery !== ""){
        concertList.innerHTML = ""; // Clear the loaded list
        allConcerts = searchByName(allConcerts, searchQuery); //if there is a search, do the filter 
    }
    
    allConcerts.forEach(concert => {
        
        // Create card 
        const card = document.createElement('div');
        card.classList.add('concert-card');
    
        // Create image element
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('concert-image');
        const img = document.createElement('img'); // create the element itself
        img.src = `data:image/jpeg;base64,${concert.picture}`; // the pic saves as base 64 string, that line will help us see it as a picture
        img.alt = `${concert.artist_name} Concert`;
        imgContainer.appendChild(img);
    
        // Create content element
        const content = document.createElement('div');
        content.classList.add('concert-content');
        
        // Add concert details
        content.innerHTML = `
            <h3>${concert.artist_name}</h3>
            <p>Date: ${concert.date}</p>
            <p>Time: ${concert.hour}</p>
            <p>Doors Open: ${concert.door_opening}</p>
            <p>Location: ${concert.location}</p>
            <p>Tickets Available: ${concert.tickets_available} / ${concert.ticket_amount}</p>
        `;
        
        // Create actions container for buttons(edit and remove)
        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('concert-actions');
        
        // Create Edit button
        const editButton = document.createElement('a');
        editButton.classList.add('btn','btn-outline-primary', 'btn-edit');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editConcert(concert._id);  // Attach editConcert function
        
        // Create Remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-outline-danger', 'bi', 'bi-trash3');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeConcert(concert._id);  // Attach removeConcert function
        
        // Append buttons to actions container
        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(removeButton);
        
        // Append image, content, and actions to the card
        card.appendChild(imgContainer);
        card.appendChild(content);
        card.appendChild(actionsContainer);
    
        // Add the card to the container
        concertsContainer.appendChild(card);
    });
    
}
loadConcerts();

async function fetchConcerts() {
    const url = '/api_concerts'
    //in the next line, insert the correct url 
    //const url = `/api/orders/by-owner?owner=${encodeURIComponent(userData.fullName)}` //the url that provides me the data
    const raw_data = await fetch(url)  //the actual data from the db        
    const concerts = await raw_data.json() //convert the raw data to json -> new obj called orders   
    return concerts
}

async function removeConcert(concertId) {
    // Example of removing a concert by its ID
    try {
        const response = await fetch(`/api_concerts/concert/${concertId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert("Concert removed successfully.");
            window.location.href = `/admin.html`

        } else {
            alert("Failed to remove concert.");
        }
    } catch (error) {
        console.error("Error removing concert:", error);
        alert("An error occurred. Please try again.");
    }
}

async function editConcert(id) {    
    console.log("edit ", id)
    window.location.href = `/edit_concert.html?id=${id}`
}

// working with graph #1
async function renderChart() {
    const chartData = await fetchConcerts();
    // Get today's date
    const today = new Date();
    // Filter and sort concerts based on date, and select the next 10 concerts
    const upcomingConcerts = chartData
        .filter(concert => new Date(concert.date) >= today) // Keep only concerts in the future
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
        .slice(0, 10); // Select only the next 10 concerts

    // Extract labels (concert names) and calculate tickets sold percentage
    const labels = upcomingConcerts.map(concert => `${concert.artist_name} (${concert.date})`); // Combine artist name and date
    const ticketsSoldPercentage = upcomingConcerts.map(concert => 
        ((concert.ticket_amount - concert.tickets_available) / concert.ticket_amount) * 100 // Calculate percentage of tickets sold
    );

    const ctx = document.getElementById('Chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar', // 'bar' for comparing concerts
        data: {
            labels: labels,
            datasets: [{
                label: 'Tickets Sold (%)',
                data: ticketsSoldPercentage,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)', // Border color
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100, // Percent scale max is 100%
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Append '%' to the y-axis labels
                        }
                    }
                }
            }
        }
    });
}

renderChart();

//filter function , gets an arr of concerts , return filtered arr
function searchByName(concerts, searchQuery) {
    console.log(searchQuery);
    const filteredResults = concerts.filter(e => {
        const lowerCase = searchQuery.toLowerCase();
        return e.artist_name.toLowerCase().includes(lowerCase);
    })

    return filteredResults
}

// Function to validate the form inputs
function validateForm(event) {
    event.preventDefault(); // Prevents form submission

    // Get the form values
    const doorOpening = document.getElementById('doorOpening').value;
    const concertHour = document.getElementById('concertHour').value;
    const concertDate = document.getElementById('concertDate').value;

    //check open hour < start hour
    if (!concertName || !concertDate || !ticketAmount) {
        alert('Please fill in all fields.');
        return false; // Validation failed
    }

    // More validations can go here (e.g., check date format, ticket number validity, etc.)

    alert('Form is valid!');
    document.getElementById('concertForm').submit(); // Submit the form after validation
}

// Attach the validation function to the form submit event
//document.getElementById('concertForm').addEventListener('submit', validateForm);
