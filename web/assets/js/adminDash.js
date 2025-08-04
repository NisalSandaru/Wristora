function loadAdminData() {
    loadAdOrderItems();
}

async  function loadAdOrderItems() {

    const popup = new Notification();
    const response = await fetch("LoadAdOrderItems");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const order_item_container = document.getElementById("adorder-item-container");

            order_item_container.innerHTML = "";

            let count = "#00";

            json.orderList.forEach(order => {

                let tableData = `<tr>
                                                            <td>${count + order.id}</td>
                                                            <td class="wide-column">${order.createdAt}</td>
                                                            <td>${order.orderStatus.value}</td>
                                                            
                                                            <td><a href="#" class="btn btn-medium btn-style-1">View</a></td>
                                                        </tr>`;

                order_item_container.innerHTML += tableData;
            });

        } else if (json.message === "Please log in.") {
            window.location = "adminSign-in.html";
        } else {
            popup.error({
                message: json.message
            });
        }
    } else if (json.message === "Please log in.") {
        window.location = "adminSign-in.html";
    } else {
        popup.error({
            message: "Order Items Loading Failed"
        });
    }
}