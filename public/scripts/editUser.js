async function getUser() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    try {
        const res = await fetch(`http://localhost/api/user/${Id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

async function putData() {
    const data = await getUser(); 
    document.getElementById("registrationForm").action = `/api/user/${data._id}`
    document.getElementById("full_name").value = data.full_name;
    document.getElementById("username").value = data.username;
    document.getElementById("password").value = data.password;
    document.getElementById("mail").value = data.mail;
    document.getElementById("phone").value = data.phone;
    document.getElementById("address_number").value = data.address.number;
    document.getElementById("address_street").value = data.address.street;
    document.getElementById("address_city").value = data.address.city;
    document.getElementById("gender").value = data.gender;
    document.getElementById("kind").value = data.kind;
}

async function submit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    res = await fetch(`http://localhost/api/user/${id}`, {
        method: "POST"
    })

    window.location.href("/")
}

putData();