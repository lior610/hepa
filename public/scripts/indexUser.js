async function getConcerts() {
    const url = "/api/"; // Ensure this URL matches your API endpoint
    const res = await fetch(url);
    const results = await res.json();
    console.log(results);

    const tableBody = document.getElementById("tablebody");

    // Clear existing table rows
    tableBody.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let concert = document.getElementById("tablerow").innerHTML;

        for (const key in result) {
            let data = "";
            if (typeof(result[key]) == "object") {
                for (const innerKey in result[key]) {
                    data += result[key][innerKey] + ", ";
                }
                data = data.replace(/, $/, ''); // Remove trailing comma
            } else {
                data = result[key];
            }
            concert = concert.replace("{" + key + "}", data);
        }

        concert = concert.replace("{_id}", result["_id"]);
        tableBody.innerHTML += concert;
    }
}

async function deleteUser(id) {
    await fetch(`/api/user/${id}`, {
        method: "DELETE",
    })
    window.location.href = "/"
}

async function editUser(id) {
    window.location.href = `/edituser.html?id=${id}`
}
getUsers()