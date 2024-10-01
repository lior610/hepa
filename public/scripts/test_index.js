async function getUsers(){
    const url = "/api_users/"
    const res = await fetch(url)
    const results = await res.json()
    console.log(results)
    for (let i = 0; i < results.length; i++ ) {
        let result = results[i]
        let user = document.getElementById("tablerow").innerHTML;
        for (const key in result) {
            let data = "";
            if (typeof(result[key]) == "object") {
                for (const innerKey in result[key]) {
                    data += result[key][innerKey] + ", "
                }
            }
            else {
                data = result[key]
            }
            user = user.replace("{" + key + "}", data)
        }
        user = user.replace("{_id}", result["_id"])
        document.getElementById("tablebody").innerHTML += user
    }

}
async function deleteUser(id) {
    await fetch(`/api_users/user/${id}`, {
        method: "DELETE",
    })
    window.location.href = "/"
}

async function editUser(id) {
    window.location.href = `/edituser.html?id=${id}`
}
getUsers()