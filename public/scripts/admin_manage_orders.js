function fetchOrders() {
    return $.ajax({
        url: "/api_orders",
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
    
}

function removeOrder(orderId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this order?')) {
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
