let currentPage = 0;
const adproPerPage = 20;
let totalPages = 0;

function loadProData() {
    loadAdProItems();
    loadBrandData();
}


async function loadAdProItems(firstResult = 0) {
    const popup = new Notification();
    const response = await fetch("LoadAdProItems?firstResult=" + firstResult);
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.status) {
            const pro_item_container = document.getElementById("adpro-item-container");
            pro_item_container.innerHTML = "";

            json.productList.forEach(pro => {
                let tableData = `<tr>
                                    <td>${pro.id}</td>
                                    <td class="wide-column">${pro.title}</td>
                                    <td class="wide-column">${pro.model.brand.name}</td>
                                    <td>${pro.color.value}</td>
                                    <td>${pro.qty}</td>
                                    <td class="wide-column">${pro.price}</td>
                                    <td class="wide-column">
                                        <button class="btn btn-medium btn-style-1" onclick="updateStatus(${pro.id}, ${pro.status.id})">
                                            ${pro.status.value}
                                        </button>
                                    </td>
                                    <td><a href="#" class="btn btn-medium btn-style-1">View</a></td>
                                </tr>`;
                pro_item_container.innerHTML += tableData;
            });

            totalPages = Math.ceil(json.allProductCount / adproPerPage);
            updatePaginationUI();
        } else {
            popup.error({message: json.message});
        }
    } else {
        popup.error({message: "Product Items Loading Failed"});
}
}

async function updateStatus(id){
    console.log(id);
    const popup = new Notification();
    const data = {
        id: id
    };

    const dataJson = JSON.stringify(data);

    const response = await fetch("UpdateStatus", {
        method: "POST",
        body: dataJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const json = await response.json(); // if servlet returns JSON
        if (json.status) {
            popup.success({
                message: json.message || "Status Updated successfully!"
            });
            loadAdProItems();
        } else if (json.message == "Please sign in!") {
            window.location = "adminSign-in.html";
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Failed to send data to server."
        });
    }
}

function updatePaginationUI() {
    const container = document.getElementById("st-pagination-container");
    container.innerHTML = "";

    // First & Prev
    container.appendChild(createPaginationLink("|<", () => goToPage(0), currentPage === 0));
    container.appendChild(createPaginationLink("<", () => goToPage(currentPage - 1), currentPage === 0));

    // Page Numbers
    for (let i = 0; i < totalPages; i++) {
        const isActive = i === currentPage;
        container.appendChild(createPaginationLink((i + 1).toString(), () => goToPage(i), false, isActive));
    }

    // Next & Last
    container.appendChild(createPaginationLink(">", () => goToPage(currentPage + 1), currentPage === totalPages - 1));
    container.appendChild(createPaginationLink(">|", () => goToPage(totalPages - 1), currentPage === totalPages - 1));
}

function createPaginationLink(text, onClick, disabled = false, active = false) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = text;

    if (disabled) {
        li.classList.add("disabled");
        a.style.pointerEvents = "none";
        a.style.opacity = "0.5";
    }

    if (active) {
        a.classList.add("current");
    }

    a.addEventListener("click", (e) => {
        e.preventDefault();
        if (!disabled)
            onClick();
    });

    li.appendChild(a);
    return li;
}

function goToPage(page) {
    if (page < 0 || page >= totalPages)
        return;
    currentPage = page;
    loadAdProItems(currentPage * adproPerPage);
}


//////////download report
async function downloadPDF() {
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
    document.querySelectorAll("#allProducts thead th").forEach(th => {
        headers.push(th.innerText);
    });

    // === Table Body Data ===
    const rows = [];
    document.querySelectorAll("#allProducts tbody tr").forEach(tr => {
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
    doc.save("Product_Report.pdf");
}

//add brand
async function addBrand() {
    const popup = new Notification();
    const brand = document.getElementById("addNewbrand").value;
    console.log(brand);
    const data = {
        brand: brand
    };

    const dataJson = JSON.stringify(data);

    const response = await fetch("AddBrand", {
        method: "POST",
        body: dataJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const json = await response.json(); // if servlet returns JSON
        if (json.status) {
            popup.success({
                message: json.message || "Brand added successfully!"
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else if (json.message == "Please sign in!") {
            window.location = "adminSign-in.html";
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Failed to send brand data to server."
        });
    }
}

async function loadBrandData() {
    const response = await fetch("LoadProdcutData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadSelect("sbrand", json.brandList, "name");
        } else {
            document.getElementById("message").innerHTML = "Something went wrong. Please try again later";
        }
    } else {
        document.getElementById("message").innerHTML = "Product loading failed. Please try again";
    }
}

function loadSelect(selectId, items, property) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });
}


////////////Add Model
async function addModel() {
    const popup = new Notification();
    const model = document.getElementById("newmodel").value;
    const brandId = document.getElementById("sbrand").value;
    const data = {
        brandId: brandId,
        model: model
    };

    console.log(data);
    const dataJson = JSON.stringify(data);

    const response = await fetch("AddModel", {
        method: "POST",
        body: dataJson,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const json = await response.json(); // if servlet returns JSON
        if (json.status) {
            popup.success({
                message: json.message || "Model added successfully!"
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else if (json.message == "Please sign in!") {
            window.location = "adminSign-in.html";
        } else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Failed to send model data to server."
        });
    }
}