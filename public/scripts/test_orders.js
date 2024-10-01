async function getOrders(){
    const url = "/api_orders" //the url that provides me the data
    const raw_data = await fetch(url)  //the actual data from the db
    const orders = await raw_data.json() //convert the raw data to json -> new obj called orders 
    console.log(orders)                //help me see the orders in console 
    for (let i = 0; i < orders.length; i++ ) {
        let order = orders[i]  //for each item
        let table_row = document.getElementById("tablerow").innerHTML;
        for (const key in order) { //go over all fields
            let data = "";
            if (typeof(order[key]) == "object") {
                for (const innerKey in order[key]) {
                    data += order[key][innerKey] + ", "
                }
            }
            else {
                data = order[key]
            }
            table_row = table_row.replace("{" + key + "}", data) 
        }
        table_row = table_row.replace("{_id}", order["_id"])
        document.getElementById("tablebody").innerHTML += table_row
    }

}
async function deleteOrder(id) {
    await fetch(`/api_orders/order/${id}`, {
        method: "DELETE",
    })
    window.location.href = "/orders.html"
}

async function editOrder(id) {
    window.location.href = `/edit_order.html?id=${id}`
}
getOrders()