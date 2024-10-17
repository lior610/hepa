if (typeof allOrders === 'undefined') {
    let allOrders = []; // Declare it if it hasn't been declared
    let partOrders = [];
    let index;
}

index = 6;

function fetchOrders() {
    return $.ajax({
        url: "/api_orders",
        method: "GET",
        dataType: "json"
    });
}

function showLoadMoreButton() {
    $('#load-more').show();
}

function hideLoadMoreButton() {
    $('#load-more').hide();
}

// Load more concerts
function loadMoreOrders() {
    index += 6;
    partOrders = allOrders.slice(0, index);
    loadOrders(partOrders);
    if (index >= allOrders.length) {
        hideLoadMoreButton();
    } else {
        showLoadMoreButton();
    }
}

// Function to fetch orders and populate the table
function loadOrders(orders) {
    const parent = $('#card-row');
    parent.empty();

    orders.forEach(order => {
        const card = `<div class="col-lg-4 col-md-6 col-sm-12 col-12 d-flex mb-4">
                        <div class="card regular-card text-center w-100 p-2"> <!-- Reduced padding with p-2 -->
                            <div class="card-body regular-card-body p-2"> <!-- Reduced padding with p-2 -->
                                <h5 class="card-title regular-card-title mb-2">${order.owner}</h5> <!-- Less margin with mb-2 -->
                                <p class="card-text regular-text mb-1">Concert: ${order.concert}</p> <!-- Less margin with mb-1 -->
                                <p class="card-text regular-text mb-1">Tickets number: ${order.tickets_number}</p>
                                <p class="card-text regular-text mb-1">Status: ${order.status}</p>
                                <p class="card-text regular-text mb-1">Date: ${order.date}</p>
                                <p class="card-text regular-text mb-1">Payment: ${order.payment}</p>
                                <p class="card-text regular-text mb-1">concert ID: ${order.concert_id}</p>
                                <button type="button" class="btn btn-primary my-1 card-butn" onclick="editOrder('${order._id}')">Edit</button> <!-- Small button with btn-sm -->
                                <button type="button" class="btn btn-primary my-1 card-butn" onclick="removeOrder('${order._id}')">Remove</button> <!-- Small button with btn-sm -->
                            </div>
                        </div>
                    </div>

        `
        parent.append(card);
    });
}


// Example Edit and Remove button functionality (stub)
function editOrder(orderId) {
    window.location.href = `/edit_order.html?id=${orderId}`
    
}

function removeOrder(orderId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this order?')) {
        $.ajax({
            url: `/api_orders/order/${orderId}`,
            type: 'DELETE',
            success: function() {
                location.reload();
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
                responsive: true, 
                maintainAspectRatio: false,
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

function applyFilters() {
    const status = $('#status').val();
    const date = $('#date').val();
    const owner = $('#owner').val().toLowerCase();
    const show = $('#show').val().toLowerCase();

    let filtered_orders = allOrders.filter(e => {
        const orderDate = new Date(e.date);
        const statusMatch = status === "" || e.status === status;
        const dateMatch = date == "" || date == e.date;
        const ownerMatch = owner == "" || e.owner.toLowerCase().includes(owner)
        const showMatch = show == "" || e.concert.toLowerCase().includes(show)
        return statusMatch && dateMatch && ownerMatch && showMatch;
    })
    loadOrders(filtered_orders)
    hideLoadMoreButton();
}

function clearFilters() {
    loadOrders(partOrders);
    if (index <= allOrders.length) {
        showLoadMoreButton();
    }
}

$(document).ready(function() {
    fetchOrders().done((orders) => { 
        allOrders = orders;
        partOrders = allOrders.slice(0, index);
        loadOrders(partOrders);
     }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading orders:', textStatus, errorThrown);
    });
    renderClosedOrdersChart();
});
