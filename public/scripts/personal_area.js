//permenet varibles
const cartList = $("#shoppingCart");
let userData;

// Take the users data
async function getUserData() {
    const res = await $.get("/api_login/username");
    const username = res.username;

    const userDetailsRes = await $.get(`/api_users/user/${username}`);
    return userDetailsRes;
}

// Function to load user data
function loadUserData() {
    const userDetailsDiv = $("#userDetails");
    userDetailsDiv.html(`
        <p><strong>Full Name:</strong> ${userData.full_name}</p>
        <p><strong>Username:</strong> ${userData._id}</p>
        <p><strong>Email:</strong> ${userData.mail}</p>
        <p><strong>Phone:</strong> ${userData.phone}</p>
        <button id="editButton" class="btn btn-primary">Edit</button>
        `);

    $("#editButton").on("click", function() {
        enableEditUserDetails();
    });    
}

function enableEditUserDetails() {
    const userDetailsDiv = $("#userDetails");

    // Replace the static text with input fields
    userDetailsDiv.html(`
        <div class="form-group">
            <label for="fullName">Full Name:</label>
            <input type="text" id="fullName" class="form-control" value="${userData.full_name}">
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" class="form-control" value="${userData.mail}">
        </div>
        <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="text" id="phone" class="form-control" value="${userData.phone}">
        </div>
            <div class="form-group">
            <label for="addressNumber">House Number:</label>
            <input type="number" id="addressNumber" class="form-control" value="${userData.address.number}" required>
        </div>

        <div class="form-group">
            <label for="addressStreet">Street:</label>
            <input type="text" id="addressStreet" class="form-control" value="${userData.address.street}" required>
        </div>

        <div class="form-group">
            <label for="addressCity">City:</label>
            <input type="text" id="addressCity" class="form-control" value="${userData.address.city}" required>
        </div>
        <button id="saveButton" class="btn btn-success">Save</button>
    `);

    // Add event listener to the Save button
    $("#saveButton").on("click", function() {
        saveUserDetails();
    });
}
// save user details
function saveUserDetails() {
    let Id= userData._id
    const updatedUserData = {
        _id: userData._id,
        full_name: $("#fullName").val(),
        password: userData.password,
        mail: $("#email").val(),
        phone: $("#phone").val(),
        address_number: $("#addressNumber").val(),  
        address_street: $("#addressStreet").val(),  
        address_city: $("#addressCity").val(),          
        gender: userData.gender,
        kind: userData.kind

    };

    // send the updated data to server
    $.ajax({
        url: `/api_users/user/edit_details/${Id}`,  
        method: 'POST',
        data: updatedUserData,
        success: function(response) {
            alert('Your details updated successfully!');
            getUserData().then(data => {
                userData = data;
                loadUserData()});
        },
        error: function() {
            alert('Failed to update user details.');
        }
    });
}

// Function to load paid orders
async function loadOrders() {
    const ordersDiv = document.getElementById("paidOrders");
    const cartList = document.getElementById("shoppingCart");
    allOrders = await fetchUserOrders() //get all orders
    // count open\close orders
    let openOrders = 0 
    let closeOrders = 0 
    // filer by status- close
    allOrders.forEach(order => {
        //add to my orders
        if(order.status == "close")
        {   
            closeOrders ++;
            const orderDiv = document.createElement("div");
            orderDiv.innerHTML = `
                <p><strong>Concert:</strong> ${order.concert}</p>
                <p><strong>Quantity:</strong> ${order.tickets_number}</p>
                <p><strong>Payment:</strong> $${order.payment}</p>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Status: Paid</strong> ${order.status}</p>
                <hr>
            `;
            ordersDiv.appendChild(orderDiv);
        }
        //add to chart
        else{
            openOrders ++;
            const li = document.createElement("li");
            li.innerHTML = `<p>${order.concert} - Quantity: ${order.tickets_number}, Price: $${order.payment}</p>
                        <button id="btn-delete-order" class="btn btn-outline-danger bi bi-trash3" data-id="${order._id}" onclick="deleteOrder('${order._id}')"> remove</button>
                        <hr>
                        `;
            cartList.appendChild(li);
        }
    });
    console.log('openOrders ', openOrders)
    // if there are no open\close orders, write it to user
    if (closeOrders == 0){
        ordersDiv.innerHTML = "<p>No upcoming events </p>";
    }
    console.log('closeOrders ', closeOrders)
    if (openOrders == 0){
        cartList.innerHTML = "<p>Your cart is currently empty </p>";
    }
    
    
}

async function fetchUserOrders() {
    const url = `/api_orders/orders/by-owner?owner=${encodeURIComponent(userData._id)}`;
    const orders = await $.get(url); // Get the actual data from the db
    return orders;
}

getUserData().then(data => {
    userData = data;
    loadUserData();
    loadOrders();
    fetchUserOrders()
});


// Listeners
$(document).ready(function() {
    const payButton = $('#payButton');
    payButton.on('click', handlePayment); // Add click event listener to the Pay button
});

// Event delegation for delete button
cartList.on('click', '.btn-outline-danger', function() {
    const orderId = $(this).data('id'); // Take the Order ID from the clicked button
    deleteOrder(orderId); // Call deleteOrder function with the specific order ID
});

async function deleteOrder(id) {
    await $.ajax({
        url: `/api_orders/order/${id}`,
        type: "DELETE",
    });
    
    window.location.href = "/personal_area.html"; // Redirect after deletion
}

function handlePayment() {
    console.log("Start processing payment");

    // Fetch all user's orders using AJAX
    $.ajax({
        url: `/api_orders/orders/by-owner?owner=${encodeURIComponent(userData._id)}`,
        method: 'GET',
        success: function(allOrders) {
            // Step 2: Prepare an array of promises for updating orders and tickets
            const updatePromises = allOrders.map(order => {
                if (order.status === "open") {
                    // Check if enough tickets are available before proceeding
                    return checkTicketAvailability(order)
                        .then((isAvailable) => {
                            if (isAvailable) {
                                // Proceed with updating the order and tickets
                                return updateOrderPayd(order)
                                    .then(() => updateTickets(order));
                            } else {
                                return Promise.reject(`Not enough tickets available for concert ${order.concert}`);
                            }
                        });
                }
            }).filter(Boolean); // Filter out undefined promises

            // Wait for all updates to finish before redirecting
            Promise.all(updatePromises)
                .then(() => {
                    window.location.href = "/personal_area.html"; // Redirect after successful payment
                })
                .catch(error => {f
                    console.error("Error during payment processing:", error);
                    alert(error); // Display the error to the user
                });
        },
        error: function(error) {
            console.error("Error fetching user orders:", error);
        }
    });
}

async function checkTicketAvailability(order) {
    return fetchConcert(order.concert_id)
        .then(concert => {
            const messageDiv = $('#ticketAvailabilityMessage'); // Select the message div

            if (!concert) {
                // Show an error message if the concert is not found
                messageDiv.text("Concert not found").show();
                return false;
            }

            // Check if there are enough available tickets
            if (concert.tickets_available < order.tickets_number) {
                // Display the message in the HTML if there aren't enough tickets
                messageDiv.text(`Ops, someone just bought those tickets. There are only ${concert.tickets_available} tickets left. Hurry to order!`).show();
                return false; // Not enough tickets
            }

            // If tickets are available, hide the message and return true
            messageDiv.hide(); // Hide the message if tickets are available
            return true;
        })
        .catch(error => {
            console.error("Error checking ticket availability:", error);
            $('#ticketAvailabilityMessage').text("Error checking ticket availability. Please try again.").show();
            return false;
        });
}


async function updateOrderPayd(order){
    // change to closed          
    order.status = "close" //close the order   
    // update order date
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    order.date = formattedDate; // Update the date property            
    return $.ajax({
        url: `/api_orders/order/${order._id}`, // Adjust the endpoint as needed
        method: 'POST',
        contentType: 'application/json', // Set the content type to JSON
        data: JSON.stringify(order) // Convert the object into a JSON string
    });
}
async function updateTickets(order) {
    const concertID = order.concert_id;

    // Fetch concert data by ID
    return fetchConcert(concertID) // Call fetchConcert, ensure it returns a promise
        .then(concert => {
            if (!concert) {
                console.error('Concert not found for ID:', concertID);
                return Promise.reject('Concert not found.');
            }

            // Calculate the new number of available tickets
            const newTicketsAvailable = concert.tickets_available - order.tickets_number;

            // Check if there are enough tickets (this should not happen since it's checked earlier)
            if (newTicketsAvailable < 0) {
                console.error('Not enough tickets available');
                return Promise.reject('Not enough tickets available');
            }

            console.log('Updating tickets for concert:', concertID);
            console.log('Previous tickets available:', concert.tickets_available);
            console.log('New tickets available:', newTicketsAvailable);

            // Update the concert with the new ticket count
            return $.ajax({
                url: `/api_concerts/concert/tickets/${concert._id}`, // Update the concert's ticket count
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    tickets_available: newTicketsAvailable
                })
            }).then(response => {
                console.log(`Concert ${concertID} tickets successfully updated.`);
            }).catch(error => {
                console.error('Error updating tickets:', error);
                return Promise.reject('Failed to update tickets');
            });
        })
        .catch(error => {
            console.error('Error fetching or updating concert:', error);
            return Promise.reject(error);
        });
}



async function fetchConcert(concertId) {
    const url = `/api_concerts/concert/${concertId}`;
    const response = await fetch(url, { method: "GET" });
    
    if (response.ok) {
        const concertData = await response.json();
        return concertData[0]; // Assuming your API returns an array
    } else {
        console.error('Error fetching concert:', concertId);
        return null;
    }
}
