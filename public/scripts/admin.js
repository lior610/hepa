//permenet varibles
const cartList = document.getElementById("shoppingCart");

// Mock user data (replace with actual API call)
const userData = {
    fullName: "Maya Shuhman",
    username: "amit_y",
    email: "amit.yahalom@example.com",
    phone: "0555555555",
    
};


// Function to load FUTURE concerts 
async function loadConcerts() {
    const concertsContainer = document.getElementById("concertList");
    //const cartList = document.getElementById("shoppingCart");
    allConcerts = await fetchConcerts() //get all concerts
    
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

// Function to fetch orders data from API


loadConcerts();

async function fetchConcerts() {
    const url = '/api_concerts'
    //in the next line, insert the correct url 
    //const url = `/api/orders/by-owner?owner=${encodeURIComponent(userData.fullName)}` //the url that provides me the data
    const raw_data = await fetch(url)  //the actual data from the db        
    const orders = await raw_data.json() //convert the raw data to json -> new obj called orders      
    console.log(orders)
    return orders
}


async function removeConcert(concertId) {
    // Example of removing a concert by its ID
    try {
        const response = await fetch(`/api_concerts/concerts/${concertId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert("Concert removed successfully.");
            // Optionally, remove the card from the DOM
            document.querySelector(`#concert-${concertId}`).remove();
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

// working with graph
async function renderChart() {
    const chartData = await fetchConcerts();
    
    // Extract labels (concert names) and calculate tickets sold percentage
    const labels = chartData.map(concert => concert.artist_name); // Concert names (artist names)
    const ticketsSoldPercentage = chartData.map(concert => 
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


