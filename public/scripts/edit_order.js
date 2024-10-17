
async function getOrder() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    try {
        const res = await fetch(`/api_orders/order/${id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

async function populateForm() {
    const data = await getOrder(); 
    if (data) {
        
        document.getElementById("editOrderForm").action = `/api_orders/order/${data._id}`;
        document.getElementById("owner").value = data.owner;
        document.getElementById("concert").value = data.concert;
        document.getElementById("tickets_number").value = data.tickets_number;
        document.getElementById("status").value = data.status;
        document.getElementById("date").value = data.date;  // Ensure this matches the format used in the input
        document.getElementById("payment").value = data.payment;
        // Set the hidden concert_id field 
        document.getElementById("concert_id").value = data.concert_id;
    }
}

$(document).ready(function () {
    $('#editOrderForm').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission immediately

        const formData = $(this).serialize();

        // Send AJAX request
        $.ajax({
            type: 'POST', 
            url: $(this).attr('action'), // Use the form's action attribute as the URL
            data: formData,
            success: function (response) {
                // Handle the success response here
                alert(response.message); // Display success message or update UI accordingly
            },
            error: function (xhr) {
                // Handle the error response here
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
                alert(errorMessage); // Display error message
            }
        });
    });
});

populateForm();