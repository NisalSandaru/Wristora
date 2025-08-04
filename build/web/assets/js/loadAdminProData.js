let currentPage = 0;
const adproPerPage = 10;
let totalPages = 0;

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
                                    <td class="wide-column">${pro.price}</td>
                                    <td class="wide-column">${pro.status.value}</td>
                                    <td><a href="#" class="btn btn-medium btn-style-1">View</a></td>
                                </tr>`;
                pro_item_container.innerHTML += tableData;
            });

            totalPages = Math.ceil(json.allProductCount / adproPerPage);
            updatePaginationUI();
        } else {
            popup.error({ message: json.message });
        }
    } else {
        popup.error({ message: "Product Items Loading Failed" });
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
        if (!disabled) onClick();
    });

    li.appendChild(a);
    return li;
}

function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    loadAdProItems(currentPage * adproPerPage);
}

