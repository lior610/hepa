async function fetchOrders() {    
    const url = "/api_orders" //the url that provides me the data
    const raw_data = await fetch(url)  //the actual data from the db        
    const orders = await raw_data.json() //convert the raw data to json -> new obj called orders
    console.log(orders)
    return orders
}
// Function to fetch orders and populate the table
async function loadOrders() {
    try {
        // Fetch the orders from the backend (API call)
        const orders = await fetchOrders()
        console.log(orders)

        // Select the table body where rows will be added
        const tableBody = document.querySelector('#ordersTable tbody');

        // Clear existing rows (if any)
        //tableBody.innerHTML = '';

        // Loop through the orders and create table rows
        orders.forEach(order => {
            const row = document.createElement('tr');
            console.log(typeof order.date); 
            console.log(order.date);
            // Create table data cells for each order attribute
            row.innerHTML = `
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
            `;

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Example Edit and Remove button functionality (stub)
function editOrder(orderId) {
    console.log('Edit order', orderId);
    // Add your editing logic here
}

function removeOrder(orderId) {
    console.log('Remove order', orderId);
    // Add your removing logic here (API call to delete order)
}

// Load orders when the page is loaded
loadOrders();

//admin orders chert functions
async function fetchClosedOrders() {
    const response = await fetch('/api_orders/orders/closed'); // Adjust the API endpoint as needed
    if (!response.ok) {
        throw new Error('Failed to fetch closed orders');
    }
    return await response.json();
}

function processClosedOrdersData(orders) {
    const ordersCountByDate = {};
    
    orders.forEach(order => {
        const date = order.date; // Ensure date is formatted correctly (YYYY-MM-DD)
        if (ordersCountByDate[date]) {
            ordersCountByDate[date]++;
        } else {
            ordersCountByDate[date] = 1;
        }
    });

    // Convert the object to arrays for Chart.js
    const labels = Object.keys(ordersCountByDate);
    const data = Object.values(ordersCountByDate);
    
    return { labels, data };
}
async function renderClosedOrdersChart() {
    const closedOrders = await fetchClosedOrders();
    const { labels, data } = processClosedOrdersData(closedOrders);
    const ctx = document.getElementById('closedOrdersChart').getContext('2d');
    const closedOrdersChart = new Chart(ctx, {
        type: 'line', // Use line chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Closed Orders',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                tension: 0.1 // Smooth the line
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
}
renderClosedOrdersChart()
