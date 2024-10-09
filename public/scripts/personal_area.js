//permenet varibles
const cartList = document.getElementById("shoppingCart");
let userData;

// Mock user data (replace with actual API call)
async function getUserData() {
    const res = await fetch("/api_login/username");
    const resObject = await res.json();
    const username = resObject["username"];

    const userDetailsRes = await fetch(`/api_users/user/${username}`);
    const userDetails = await userDetailsRes.json();

    return userDetails;
}

// Function to load user data
function loadUserData() {
    const userDetailsDiv = document.getElementById("userDetails");
    userDetailsDiv.innerHTML = `
        <p><strong>Full Name:</strong> ${userData.full_name}</p>
        <p><strong>Username:</strong> ${userData._id}</p>
        <p><strong>Email:</strong> ${userData.mail}</p>
        <p><strong>Phone:</strong> ${userData.phone}</p>
    `;
}

// Function to load paid orders
async function loadOrders() {
    const ordersDiv = document.getElementById("paidOrders");
    //const cartList = document.getElementById("shoppingCart");
    allOrders = await fetchUserOrders() //get all orders
    // filer by status- close
    console.log(allOrders);
    allOrders.forEach(order => {
        //add to my orders
        if(order.status == "close")
        {
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
            const li = document.createElement("li");
            li.innerHTML = `<p>${order.concert} - Quantity: ${order.tickets_number}, Price: $${order.payment}</p>
                        <button id="btn-delete-order" class="btn btn-outline-danger bi bi-trash3" data-id="${order._id}" onclick="deleteOrder('${order._id}')"> remove</button>
                        <hr>
                        `;
            cartList.appendChild(li);
        }
    });
}

// Function to fetch orders data from API
async function fetchOrders() {    
        const url = "/api_orders" //the url that provides me the data
        const raw_data = await fetch(url)  //the actual data from the db        
        const orders = await raw_data.json() //convert the raw data to json -> new obj called orders
        const userOrders = [];
        orders.forEach(order => {
            if (order.owner == userData.fullName){
                userOrders.push(order)
            }
        }) 
        return userOrders
}
async function fetchUserOrders() {    
        const url = `/api_orders/orders/by-owner?owner=${encodeURIComponent(userData.full_name)}` //the url that provides me the data
        const raw_data = await fetch(url)  //the actual data from the db        
        const orders = await raw_data.json() //convert the raw data to json -> new obj called orders      
        return orders
    }

getUserData().then(data => {
    userData = data;
    loadUserData();
    loadOrders();
    fetchUserOrders()
});


//listeners
document.addEventListener("DOMContentLoaded", () => {
    const payButton = document.getElementById('payButton');  
    payButton.addEventListener('click', handlePayment);// Add click event listener to the Pay button
});

cartList.addEventListener('click', (event) => {
    // Check if the clicked element is a remove button
    if (event.target.matches('.btn-outline-danger')) {
        const orderId = event.target.getAttribute('data-id');  //take the Order ID from the clicked button
        console.log(orderId)
        
        // Call deleteOrder function with the specific order ID
        deleteOrder(orderId);
        
        // Remove the specific list item (li)
        //const listItem = event.target.closest('li');
        //cartList.removeChild(listItem);
    }
});



async function handlePayment(){
    //when press pay, change all user's orders to "closed"
    const allOrders = await fetchUserOrders() //get all orders
    console.log(allOrders)
    //go over all user's ordeers
    for(let i=0; i<allOrders.length; i++){
        const order = allOrders[i]
        if(order.status == "open"){            
            console.log(order.concert)            
            console.log(order.status)            
            order.status = "close" //close the order
            console.log(order._id)  
                  
            const url = `/_orders/order/${order._id}`
            
            fetch(url, {
                method: 'POST', // Specify the request method so it will use Edit function
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(order) // Convert the object into a JSON string
            })
            window.location.href = "/personal_area.html"

        }
    }
}

async function deleteOrder(id) {
    await fetch(`/api_orders/order/${id}`, {
        method: "DELETE",
    })
    
    window.location.href = "/personal_area.html"
}
