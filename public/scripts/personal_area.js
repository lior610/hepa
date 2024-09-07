

// Mock user data (replace with actual API call)
const userData = {
    fullName: "Amit Yahalom",
    username: "amit_y",
    email: "amit.yahalom@example.com",
    phone: "0555555555",
    
};

// Mock shopping cart data (replace with actual API call)
const cartItems = [
    { name: "Concert Ticket - Taylor Swift", quantity: 2, price: 150 },
    { name: "Concert Ticket - Ed Sheeran", quantity: 1, price: 200 }
];

// Mock paid orders data (replace with actual API call)
const paidOrders = [
    { concert: "Beyoncé", ticketNumber: 1, payment: 200, date: "2023-09-02", status: "Paid" },
    { concert: "Ed Sheeran", ticketNumber: 2, payment: 400, date: "2023-08-15", status: "Paid" }
];

// Function to load user data
function loadUserData() {
    const userDetailsDiv = document.getElementById("userDetails");
    userDetailsDiv.innerHTML = `
        <p><strong>Full Name:</strong> ${userData.fullName}</p>
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phone}</p>
    `;
}

// Function to load shopping cart items
function loadShoppingCart() {
    const cartList = document.getElementById("shoppingCart");
    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${item.name} - Quantity: ${item.quantity}, Price: $${item.price}</p>
                        <hr>
                        `;
        cartList.appendChild(li);
    });
}

// Function to load paid orders
function loadPaidOrders() {
    const ordersDiv = document.getElementById("paidOrders");
    paidOrders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `
            <p><strong>Concert:</strong> ${order.concert}</p>
            <p><strong>Ticket Number:</strong> ${order.ticketNumber}</p>
            <p><strong>Payment:</strong> $${order.payment}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <hr>
        `;
        ordersDiv.appendChild(orderDiv);
    });
}


loadUserData();
loadShoppingCart();
loadPaidOrders();
