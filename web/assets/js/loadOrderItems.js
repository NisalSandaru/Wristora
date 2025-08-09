async function loadItems() {
    const popup = new Notification();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const orderId = searchParams.get("id");

        const response = await fetch("LoadItems?id=" + orderId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);
                let orderStatus = json.orderStatus;
                const order_item_container = document.getElementById("item-container");

                order_item_container.innerHTML = "";

                json.orderItemsList.forEach(item => {

                    let tableData = `<tr>
                                                            <td>${item.id}</td>
                                                            <td class="wide-column">${item.product.title}</td>
                                                            <td>${item.product.color.value}</td>
                                                            <td>${item.product.quality.value}</td>
                                                            <td>${item.qty}</td>
                                                            
                                                        </tr>`;

                    order_item_container.innerHTML += tableData;
                });
                document.getElementById("statusSelect").value = parseInt(orderStatus.id);
            } else {
                popup.error({
                    message: json.message
                });
            }
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Id not found"
        });
    }
}

async function loadStatus() {
    const response = await fetch("StatusData");
    if (response.ok) {
        const json = await response.json();
        const statusSelect = document.getElementById("statusSelect");

        json.forEach(status => {
            let option = document.createElement("option");
            option.innerHTML = status.value;
            option.value = status.id;
            statusSelect.appendChild(option);
        });
    }
}

async function statusUpdate() {
    const statusId = document.getElementById("statusSelect").value;
    const popup = new Notification();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const orderId = searchParams.get("id");

        const data = {
            statusId: statusId,
            orderId: orderId
        };

        const dataJSON = JSON.stringify(data);

        const response = await fetch("UpdateOrderStatus", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataJSON
        });
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                popup.success(
                        {
                            message: json.message
                        }
                );
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else if (json.message == "login") {
                window.location = "adminSign-in.html";
            } else {
                popup.error(
                        {
                            message: json.message
                        }
                );
            }
        } else {
            popup.error(
                    {
                        message: "Somthing went wrong"
                    }
            );
        }

    } else {
        popup.error({
            message: "Id not found"
        });
    }
}


//////////download report
async function downloadItemPDF() {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    // === Set Title ===
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Product Report", 14, 20);

    // === Add Date/Time ===
    const now = new Date();
    const formattedDate = now.toLocaleString(); // e.g., "7/29/2025, 3:30:00 PM"
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 14, 27);

    // === Table Headers ===
    const headers = [];
    document.querySelectorAll("#orderItems thead th").forEach(th => {
        headers.push(th.innerText);
    });

    // === Table Body Data ===
    const rows = [];
    document.querySelectorAll("#orderItems tbody tr").forEach(tr => {
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