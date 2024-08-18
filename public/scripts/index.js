async function getUsers(){
    const url = "http://localhost/api/"
    const res = await fetch(url)
    const results = await res.json()
    console.log(results)
    for (let i = 0; i < results.length; i++ ) {
        result = results[i]
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
        document.getElementById("tablebody").innerHTML += user
    }

}

getUsers()