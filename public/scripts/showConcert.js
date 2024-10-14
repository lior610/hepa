// Function to fetch concert details
function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    return $.ajax({
        url: `/api_concerts/concert/${id}`,
        method: "GET",
        dataType: "json"
    })
    .then(data => data[0]) // Return the first element of the data array
    .catch(error => {
        console.error("Error fetching concert:", error);
        return null;
    });
}

async function fetchUserOrders() {
    const res = await $.get("/api_login/username");
    const username = res.username;
    const userDetailsRes = await $.get(`/api_users/user/${username}`);
    const name = userDetailsRes._id;
    const url = `/api_orders/orders/by-owner?owner=${encodeURIComponent(name)}`;
    const orders = await $.get(url); // Get the actual data from the db
    return orders;
}

// Function to fetch the latest album based on the artist name
function getLatestAlbum(artistName) {
    return $.ajax({
        url: `/api_concerts/artist/${artistName}/latest-album`,
        method: "GET",
        dataType: "json"
    })
    .then(data => data) // Return the album data
    .catch(error => {
        console.error("Error fetching album:", error);
        return null;
    });
}

// Function to add tickets to the cart
function addToCart(concertId, ticketAmount) {
    // Hide any previous success message immediately
    hideSuccessMessage();
    
    //checks if the user is logged in
    $.get("/api_login/username").done(function(res) {
        if (!res.username) {
            alert("You must be logged in to add items to your cart. Log in and then try again.");
            window.location.href = "/login.html";
            return; 
        }

        $.get(`/api_concerts/concert/${concertId}`).done(function(concertData) {
            const concert = concertData[0];
            const availableTickets = concert.tickets_available;

            fetchUserOrders().then(orders => {
                const existingOrder = orders.find(order => order.concert_id === concertId && order.status === 'open');
                let messages = []; // Array to hold messages

                // If there's an existing order, notify the user how many tickets they already have
                if (existingOrder) {
                    messages.push(`You already have ${existingOrder.tickets_number} tickets in your cart for this concert.`);
                }

                const totalTickets = existingOrder ? parseInt(existingOrder.tickets_number) + parseInt(ticketAmount) : parseInt(ticketAmount);

                // Check if the total number of tickets exceeds the available tickets
                if (totalTickets > availableTickets) {
                    messages.push(`Only ${availableTickets} tickets left for this concert.`);
                }

                // Display all collected messages
                if (messages.length > 0) {
                    displayError(messages.join(' '));
                }

                // If there are enough available tickets, proceed to update or create the order
                if (totalTickets <= availableTickets) {
                    if (existingOrder) {
                        const newPayment = (parseInt(existingOrder.payment) / existingOrder.tickets_number) * totalTickets;
                        editOrder(existingOrder._id, totalTickets, newPayment);
                        displaySuccess("Order updated successfully.");
                    } else {
                        createOrder(concertId, ticketAmount);
                        displaySuccess("Tickets successfully added to your cart.");
                    }
                }

            }).catch(error => {
                displayError("Error fetching user orders. Please try again.");
            });
        }).fail(function() {
            displayError("Failed to fetch concert details.");
        });
    }).fail(function() {
        displayError("Failed to check login status.");
    });
}

// Function to display error messages
function displayError(message) {
    const errorContainer = document.getElementById("error-message");
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
        errorContainer.style.color = "red"; // Red for errors
    } else {
        console.error("Error element not found.");
    }
}

// Function to display success messages
function displaySuccess(message) {
    const successContainer = document.getElementById("success-message");
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.style.display = "block";
        successContainer.style.color = "green"; 
    } else {
        console.error("Success element not found.");
    }
}

// Function to hide the success message
function hideSuccessMessage() {
    const successContainer = document.getElementById("success-message");
    if (successContainer) {
        successContainer.style.display = "none"; 
    } else {
        console.error("Success element not found.");
    }
}

function showConcert() {
    getConcert().then(concertData => {
        if (concertData) {
            document.getElementById("artist_name").textContent = concertData.artist_name;
            document.getElementById("date").textContent = concertData.date;
            document.getElementById("hour").textContent = concertData.hour;
            document.getElementById("door_opening").textContent = concertData.door_opening;
            document.getElementById("location").textContent = concertData.location;
            document.getElementById("price").textContent = concertData.price;

            // Set concertId hidden input to store the concert_id
            document.getElementById("concertId").value = concertData._id;

            // Add event listener to Add to Cart button
            document.getElementById("addToCartButton").addEventListener("click", function() {
                const concertId = document.getElementById("concertId").value;
                const ticketAmount = document.getElementById("ticketAmount").value;
                addToCart(concertId, ticketAmount); // Call the addToCart function
            });

            function displayCartSuccessMessage() {
                const messageContainer = document.getElementById("cart-message");
                if (messageContainer) {
                    messageContainer.innerHTML = `
                        <p>Added to cart successfully!</p>
                        <a href="/cart" class="btn btn-primary">View Cart</a>
                    `;
                }
            }
            
            // Fetch the latest album using the artist name
            getLatestAlbum(concertData.artist_name).then(albumData => {
                if (albumData) {
                    displayAlbumInfo(albumData);
                }
            });
        }
    });
}

// Function to create a new order
async function createOrder(concertId, ticketAmount) {
    try {
        // Get username
        const res = await $.get("/api_login/username");
        const username = res.username;

        const userDetailsRes = await $.get(`/api_users/user/${username}`);
        const owner = userDetailsRes._id;
        // Get concert details
        const concertData = await getConcert();
        if (!concertData) {
            alert("Failed to fetch concert data.");
            return;
        }

        // Calculate payment (ticket price * ticket amount)
        const paymentAmount = concertData.price * ticketAmount;

        // Construct new order object
        const newOrder = {
            owner: owner, 
            concert: concertData.artist_name, 
            concert_id: concertId,
            tickets_number: ticketAmount, 
            payment: paymentAmount 
        };

        // Send the new order to the server
        $.ajax({
            url: '/api_orders/add_order', 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newOrder),
            success: function(response) {
                // Display success message and "View Cart" button
                displayCartSuccessMessage();
            },
            error: function(error) {
                console.error("Error creating order:", error);
                alert("Failed to add concert to cart.");
            }
        });
    } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order.");
    }
}

// Function to edit an existing order
async function editOrder(orderId, newTicketAmount, newPayment) {
    try {
        // Fetch the current order details
        const currentOrderRes = await $.get(`/api_orders/order/${orderId}`);

        // Access the first order in the array
        const currentOrder = currentOrderRes[0]; // Get the first element

        // Check if currentOrder is defined
        if (!currentOrder) {
            alert("No order found with the specified ID.");
            return;
        }

        // Construct the updated order, merging current details with the new ones
        const updatedOrder = {
            owner: currentOrder.owner,                    
            concert: currentOrder.concert,                 
            concert_id: currentOrder.concert_id,           
            tickets_number: newTicketAmount,                
            status: currentOrder.status,                    
            date: new Date().toISOString().split('T')[0],  
            payment: newPayment                             
        };


        // Send the updated order to the server
        $.ajax({
            url: `/api_orders/order/${orderId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedOrder),
            success: function(response) {
                alert("Cart updated!");
            },
            error: function(error) {
                console.error("Error updating order:", error);
                alert("Failed to update cart.");
            }
        });
    } catch (error) {
        console.error("Error fetching current order:", error);
        alert("Failed to fetch current order details.");
    }
}


// Function to update HTML with album info
function displayAlbumInfo(album) {
    const albumHeading = document.getElementById("album-heading");
    const albumLink = document.getElementById("album-link");
    const albumCover = document.getElementById("album-cover");

    if (albumHeading && albumLink && albumCover) {
        albumHeading.textContent = `Haven't heard ${album.name} yet?`;
        albumLink.href = album.external_urls.spotify;
        albumCover.src = album.images[0].url;
        albumHeading.classList.add("album-heading"); // Add a specific class for styling
    }
}

// Execute the showConcert function when the page loads
$(document).ready(function() {
    showConcert();
});
