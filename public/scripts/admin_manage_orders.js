function fetchOrders() {
    return $.ajax({
        url: "/api_orders",
        method: "GET",
        dataType: "json"
    });
}

function fetchOrder(id){
    return $.ajax({
        url: `/api_orders/order/${id}`,
        method: "GET",
        dataType: "json"
    });
}

// Function to fetch orders and populate the table
function loadOrders() {
    fetchOrders().done(function(orders) {
        const tableBody = $('#ordersTable tbody');
        tableBody.empty(); // Clear existing rows

        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.owner}</td>
                    <td>${order.concert}</td>
                    <td>${order.tickets_number}</td>
                    <td>${order.status}</td>
                    <td>${order.date}</td>
                    <td>${order.payment}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editOrder('${order._id}')">Edit</button>
                        <button class="btn btn-remove" onclick="removeOrder('${order._id}')">Remove</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading orders:', textStatus, errorThrown);
    });
}


// Example Edit and Remove button functionality (stub)
function editOrder(orderId) {
    console.log('Edit order', orderId);
    window.location.href = `/edit_order.html?id=${orderId}`
    
}

async function removeOrder(orderId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            // Step 1: Fetch the order details by order ID
            const orderResponse = await fetch(`/api_orders/order/${orderId}`);
            if (!orderResponse.ok) {
                throw new Error('Failed to fetch order details');
            }
            let order = await orderResponse.json();
            order = order[0]

            // Extract tickets number and concert ID from the order
            const ticketsNumber = order.tickets_number;
            const concertId = order.concert_id;

            // Step 2: Delete the order
            const deleteResponse = await fetch(`/api_orders/order/${orderId}`, {
                method: 'DELETE',
            });
            if (!deleteResponse.ok) {
                throw new Error('Failed to delete order');
            }

            // Step 3: Fetch concert details to get current available tickets
            const concertResponse = await fetch(`/api_concerts/concert/${concertId}`);
            if (!concertResponse.ok) {
                throw new Error('Failed to fetch concert details');
            }
            let concert = await concertResponse.json();
            concert = concert[0]
            const updatedTicketsAvailable = concert.tickets_available + ticketsNumber; // Update available tickets

            // Step 4: Update the concert's available tickets
            const updateTicketsResponse = await fetch(`/api_concerts/concert/tickets/${concertId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tickets_available: updatedTicketsAvailable }),
            });

            if (!updateTicketsResponse.ok) {
                throw new Error('Failed to update tickets');
            }

            // Optionally, you can refresh the orders list or UI after deletion
            loadOrders(); // Call your function to refresh the orders list
            alert('Order deleted successfully and concert tickets updated!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to remove order. Please try again.');
        }
    }
}


async function removeOrder1(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
             // Start by fetching the order and concert details
            fetchOrderAndConcert(orderId)
            .then(({ order, concert, updatedTicketsAvailable }) => {
                console.log("Order and concert fetched successfully");
                // Once we have the order and concert details, update the concert tickets
                return updateConcertTickets(concert, updatedTicketsAvailable);
            })
            .then(() => {
                console.log("Tickets updated successfully");
                // After updating the tickets, delete the order
                return quiqRemoveOrder(orderId);
            })
            .then(() => {
                console.log("Order deleted successfully");
                // Optionally, reload or update the UI here
                loadOrders();  // You can call a function to reload the orders
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Something went wrong while processing the order");
            });

        } catch (error) {
            console.error('Error during order deletion:', error);
            alert('Failed to process the order.');
        }
    }
}

function fetchOrderAndConcert(orderId) {
    return new Promise((resolve, reject) => {
        // Fetch the order details by order ID
        $.ajax({
            url: `/api_orders/order/${orderId}`,
            method: 'GET',
            success: function(orderResponse) {
                let order = orderResponse[0]; 
                console.log('order ', order) 
                const ticketsNumber = order.tickets_number;
                const concertId = order.concert_id;

                // Fetch the concert details by concert ID
                $.ajax({
                    url: `/api_concerts/concert/${concertId}`,
                    method: 'GET',
                    success: function(concertResponse) {
                        let concert = concertResponse[0];
                        console.log('concert ', concert)  
                        const updatedTicketsAvailable = concert.tickets_available + ticketsNumber;
                        concert.tickets_available = updatedTicketsAvailable
                        // Resolve both the order and concert details
                        resolve({ order, concert, updatedTicketsAvailable });
                    },
                    error: function(error) {
                        reject(`Failed to fetch concert: ${error.statusText}`);
                    }
                });
            },
            error: function(error) {
                reject(`Failed to fetch order: ${error.statusText}`);
            }
        });
    });
}
function updateConcertTickets(concert, updatedTicketsAvailable) {
    console.log('the concert is ', concert)
    console.log('updating ', concert._id, ' new val: ', updatedTicketsAvailable)
    //for remove
    return $.ajax({
        url: `/api_concerts/concert/tickets/${concert._id}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(concert),
        });
}

function quiqRemoveOrder(orderId) {
    $.ajax({
        url: `/api_orders/order/${orderId}`, // Adjust the URL according to your API
        type: 'DELETE',
        success: function() {
            // Find the row in the table and remove it
            $(`#ordersTable tbody tr`).filter(function() {
                return $(this).find('td').first().text() === orderId; // Match based on order ID
            }).remove();

            // Optionally, you can refresh the orders table by re-fetching all orders
            loadOrders();
        },
        error: function(error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        }
    });
    
}

//admin orders chert functions
function fetchClosedOrders() {
    return $.ajax({
        url: '/api_orders/orders/closed',
        method: "GET",
        dataType: "json"
    });
}


function processClosedOrdersData(orders) {
    const ordersCountByDate = {};

    // Count the number of closed orders by date
    orders.forEach(order => {
        const date = order.date; // Ensure date is formatted correctly (YYYY-MM-DD)
        if (ordersCountByDate[date]) {
            ordersCountByDate[date]++;
        } else {
            ordersCountByDate[date] = 1;
        }
    });

    // Sort dates and create arrays for Chart.js
    const sortedDates = Object.keys(ordersCountByDate).sort(); // Sort the dates
    const sortedData = sortedDates.map(date => ordersCountByDate[date]); // Get the corresponding counts

    return { labels: sortedDates, data: sortedData };
}

function renderClosedOrdersChart() {
    fetchClosedOrders().done(function(closedOrders) {
        const { labels, data } = processClosedOrdersData(closedOrders);
        const ctx = document.getElementById('closedOrdersChart').getContext('2d');
        const closedOrdersChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Closed Orders',
                    data: data,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Closed Orders'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error rendering closed orders chart:', textStatus, errorThrown);
    });
}

$(document).ready(function() {
    loadOrders();
    renderClosedOrdersChart();
});
