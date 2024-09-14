
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
        document.getElementById("ticket_number").value = data.ticket_number;
        document.getElementById("status").value = data.status;
        document.getElementById("date").value = data.date;  // Ensure this matches the format used in the input
        document.getElementById("payment").value = data.payment;
    }
}

async function submit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    console.log("the id is ", id)

    res = await fetch(`/api_orders/order/${id}`, {
        method: "POST"
    })

    window.location.href = "/orders.html"
}

//document.getElementById("editOrderForm").addEventListener("submit", submitForm);
populateForm();
