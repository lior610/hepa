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
    const ordersDiv = $("#paidOrders");
    const allOrders = await fetchUserOrders(); // Get all orders
    console.log(allOrders);
    
    allOrders.forEach(order => {
        // Add to my orders
        if (order.status === "close") {
            const orderDiv = $(`
                <div>
                    <p><strong>Concert:</strong> ${order.concert}</p>
                    <p><strong>Quantity:</strong> ${order.tickets_number}</p>
                    <p><strong>Payment:</strong> $${order.payment}</p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Status: Paid</strong> ${order.status}</p>
                    <hr>
                </div>
            `);
            ordersDiv.append(orderDiv);
        }
        // Add to cart
        else {
            const li = $(`
                <li>
                    <p>${order.concert} - Quantity: ${order.tickets_number}, Price: $${order.payment}</p>
                    <button id="btn-delete-order" class="btn btn-outline-danger bi bi-trash3" data-id="${order._id}"> remove</button>
                    <hr>
                </li>
            `);
            cartList.append(li);
        }
    });
}

// Function to fetch orders data from API
async function fetchOrders() {
    const url = "/api_orders"; // The URL that provides me the data
    const orders = await $.get(url); // Get the actual data from the db
    const userOrders = orders.filter(order => order.owner === userData.full_name);
    return userOrders;
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

async function handlePayment() {
    // When press pay, change all user's orders to "closed"
    const allOrders = await fetchUserOrders(); // Get all orders
    console.log(allOrders);
    
    // Go over all user's orders
    for (let i = 0; i < allOrders.length; i++) {
        const order = allOrders[i];
        if (order.status === "open") {
            console.log(order.concert);
            console.log(order.status);
            order.status = "close"; // Close the order
            console.log(order._id);
            const url = `/_orders/order/${order._id}`;

            // Use AJAX to update the order status
            await $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(order), // Convert the object into a JSON string
            });
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
