async function items() {
    const popup = new Notification();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const orderId = searchParams.get("id");

        const response = await fetch("Items?id=" + orderId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);
                let orderStatus = json.orderStatus;
                const order_item_container = document.getElementById("item-container");

                order_item_container.innerHTML = "";

                let count = 1;
                let total = 0;
                json.orderItemsList.forEach(item => {

                    let tableData = `<tr>
                                                            <td>${count}</td>
                                                            <td class="wide-column">${item.product.title}</td>
                                                            <td>${item.product.color.value}</td>
                                                            <td>${item.product.quality.value}</td>
                                                            <td>${item.qty}</td>
                                                            <td>${item.product.price}</td>
                                                            
                                                        </tr>`;
                    count += 1;
                    total += item.product.price;
                    order_item_container.innerHTML += tableData;
                });
                document.getElementById("allTotal").innerHTML = total;
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

async function downloadItemPDF() {
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();

    // === Set Title ===
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    // === Add Date/Time ===
    const now = new Date();
    const formattedDate = now.toLocaleString();
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

    // === Add Total as last row ===
    const totalValue = document.getElementById("allTotal").innerText;
    const totalRow = Array(headers.length).fill(""); // make empty row same length as headers
    totalRow[headers.length - 2] = "Total"; // second last column label
    totalRow[headers.length - 1] = totalValue; // last column value
    rows.push(totalRow);

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
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold"
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    // === Save PDF ===
    doc.save("Invoice.pdf");
}
