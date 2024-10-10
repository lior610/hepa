//permenet varibles
const cartList = $("#shoppingCart");
let userData;

// Mock user data (replace with actual API call)
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
    `);
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
                <p><strong>Quantity:</strong> ${order.ticket_number}</p>
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
            li.innerHTML = `<p>${order.concert} - Quantity: ${order.ticket_number}, Price: $${order.payment}</p>
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
    const url = `/api_orders/orders/by-owner?owner=${encodeURIComponent(userData.full_name)}`;
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

async function handlePayment(){
    console.log("start orders payment ")
    //when press pay:
    //      1. change all user's orders to "closed"
    //      2. update tickets number
    const allOrders = await fetchUserOrders() //get all orders
    console.log(allOrders)
    //go over all user's ordeers
    for(let i=0; i<allOrders.length; i++){
        const order = allOrders[i]
        if(order.status == "open"){  
            
            updateOrderPayd(order)
            console.log("now update sold tickets")
            updateTickets(order)  
            window.location.href = "/personal_area.html"
        }        
    }
    window.location.href = "/personal_area.html"; // Redirect after processing
}

async function deleteOrder(id) {
    await $.ajax({
        url: `/api_orders/order/${id}`,
        type: "DELETE",
    });
    
    window.location.href = "/personal_area.html"; // Redirect after deletion
}
async function updateOrderPayd(order){
    // change to closed          
    order.status = "close" //close the order   
    // update order date
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    order.date = formattedDate; // Update the date property            
    console.log(order._id)
    fetch(`/api_orders/order/${order._id}`, {
        method: 'POST', // Specify the request method so it will use Edit function
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(order) // Convert the object into a JSON string
    })
}
// update tickets avilable after payment
async function updateTickets(order){
    const concertID = order.concert_id
    console.log('given concert id: ',concertID)
    //get concert tickets
    const concert = await fetchConcert(concertID)
    prevNum = concert.tickets_available
    concert.tickets_available = prevNum - order.tickets_number
    console.log('now need to update tickets for concert: ', concertID)
    console.log('new available num should be ', concert.tickets_available)
    fetch(`/api_concerts/concert/tickets/${concert._id}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(concert) // Convert the object into a JSON string
    })
}

async function fetchConcert(concertId) {
    const url = `/api_concerts/concert/${concertId}` //the url that provides me the data
    const response = await fetch(url, {
        method: "GET"
    });       
    const concert = await response.json() //convert the raw data to json -> new obj called concert        
    console.log(concert[0])
    return concert[0]
    
}