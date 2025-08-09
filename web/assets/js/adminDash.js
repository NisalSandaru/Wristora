function loadAdminData() {
    loadAdOrderItems();
    loadAdDashCount();
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
                                                            
                                                            <td><a href="orderItems.html?id=${order.id}" class="btn btn-medium btn-style-1">View</a></td>
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


async  function loadAdDashCount() {

    const popup = new Notification();
    const response = await fetch("LoadAdDashCount");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            document.getElementById("totalOrders").textContent = json.orderCount;
            document.getElementById("totalProducts").textContent = json.productCount;
            document.getElementById("totalUsers").textContent = json.userCount;

            let revenue = 0;

            json.orderItemsList.forEach(order => {
                let price = parseFloat(order.product.price); // Ensure it's a number
                revenue += price;
            });

            document.getElementById("totalRevenue").textContent = "Rs. " + revenue.toFixed(2);

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


//////////download report
async function downloadOrderPDF() {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    // === Set Title ===
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Orders Report", 14, 20);

    // === Add Date/Time ===
    const now = new Date();
    const formattedDate = now.toLocaleString(); // e.g., "7/29/2025, 3:30:00 PM"
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 14, 27);

    // === Table Headers ===
    const headers = [];
    document.querySelectorAll("#orders thead th").forEach(th => {
        headers.push(th.innerText);
    });

    // === Table Body Data ===
    const rows = [];
    document.querySelectorAll("#orders tbody tr").forEach(tr => {
        const row = [];
        tr.querySelectorAll("td").forEach(td => row.push(td.innerText));
        rows.push(row);
    });

    // === AutoTable Generation ===
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 35,
        styles: {
            font: "times",
            fontSize: 11
        },
        headStyles: {
            fillColor: [41, 128, 185], // blue header background
            textColor: 255,
            fontStyle: "bold"
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245] // light gray
        }
    });

    // === Save PDF ===
    doc.save("OrderItem_Report.pdf");
}