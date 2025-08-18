//window.addEventListener("load",async function (){
//    const response = await fetch("MyAccount");
//});


function loadData() {
    getUserAddData();
    getUserData();
    getCityData();
    loadOrderItems();
}

async function getUserData() {
    const response = await fetch("MyAccount");
    if (response.ok) {
        const json = await response.json();
        document.getElementById("fname").value = json.firstName;
        document.getElementById("lname").value = json.lastName;
        document.getElementById("mMobile").value = json.mobile;
        document.getElementById("currentPassword").value = json.password;

        document.getElementById("addName").innerHTML = `Name : ${json.firstName} ${json.lastName}`;
        document.getElementById("dname").innerHTML = `${json.firstName}`;
        document.getElementById("nname").innerHTML = `${json.firstName}`;
        document.getElementById("addEmail").innerHTML = `Email : ${json.email}`;
        document.getElementById("contact").innerHTML = `Phone : ${json.mobile}`;

    }
}



async function getCityData() {
    const response = await fetch("CityData");
    if (response.ok) {
        const json = await response.json();
        const citySelect = document.getElementById("citySelect");

        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });
    }
}

async function getUserAddData() {
    const response = await fetch("MyAddress");
    if (response.ok) {
        const json = await response.json();

        console.log(json);
        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {
            let firstName;
            let lastName;
            let email;
            let lineOne;
            let lineTwo;
            let city;
//            let district;
            let mobile;
            let postalCode;
            const addressUL = document.getElementById("addressUL");
            json.addressList.forEach(address => {
                email = address.user.email;
                firstName = address.firstName;
                lastName = address.lastName;
                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                mobile = address.mobile;
                city = address.city.name;
//                district = address.city.district.name;
                postalCode = address.postalCode;
                cityId = address.city.id;

                const line = document.createElement("li");

                line.innerHTML = firstName + " " + lastName + ", " + "<br/>" + lineOne + ", " + "<br/>" +
                        lineTwo + ", " + "<br/>" + city + ". " + "<br/>" + postalCode;

                addressUL.appendChild(line);

            });

//            console.log(lastAddress);
            document.getElementById("shipping_fname").value = firstName;
            document.getElementById("shipping_lname").value = lastName;
            document.getElementById("lineOne").value = lineOne;
            document.getElementById("lineTwo").value = lineTwo;
            document.getElementById("mobile").value = mobile;
            document.getElementById("postalCode").value = postalCode;
            document.getElementById("citySelect").value = parseInt(cityId); //parseInt()
        }

    }
}

async function saveChanges() {

    const popup = new Notification();

    const firstName = document.getElementById("shipping_fname").value;
    const lastName = document.getElementById("shipping_lname").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const cityId = document.getElementById("citySelect").value;
    const mobile = document.getElementById("mobile").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        postalCode: postalCode,
        cityId: cityId,
        mobile: mobile
    };

    const userDataJSON = JSON.stringify(userDataObject);

    const response = await fetch("MyAddress", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userDataJSON
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            document.getElementById("message").innerHTML = json.message;
            document.getElementById("message").classList.remove("text-danger");
            document.getElementById("message").classList.add("text-success");
        } else {
            document.getElementById("message").innerHTML = json.message;
            document.getElementById("message").classList.remove("text-success");
            document.getElementById("message").classList.add("text-danger");

            popup.error(
                    {
                        message: json.message
                    }
            );
        }
    } else {
        document.getElementById("message").innerHTML = "Address update fail!";
        document.getElementById("message").classList.remove("text-success");
        document.getElementById("message").classList.add("text-danger");
    }
}

async function saveProChanges() {

    const popup = new Notification();

    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const mobile = document.getElementById("mMobile").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJSON = JSON.stringify(userDataObject);

    const response = await fetch("MyAccount", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userDataJSON
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            popup.success(
                    {
                        message: json.message
                    }
            );
        } else {

            popup.error(
                    {
                        message: json.message
                    }
            );
        }
    } else {
        document.getElementById("message").innerHTML = "Profile details update fail!";
        document.getElementById("message").classList.remove("text-success");
        document.getElementById("message").classList.add("text-danger");
    }
}



//////////////////////// load orderss ////////////////////////////////////
async  function loadOrderItems() {

    const popup = new Notification();

    const response = await fetch("loadOrderItems");
    if (response.ok) {
        const json = await response.json();

        if (json.status) {

            console.log(json);
            const order_item_container = document.getElementById("order-item-container");

            order_item_container.innerHTML = "";

            let count = "#00";

            json.orderList.forEach(order => {

                let tableData = `<tr>
                                                            <td>${count +order.id}</td>
                                                            <td class="wide-column">${order.createdAt}</td>
                                                            <td>${order.orderStatus.value}</td>
                                                            
                                                            <td><a href="items.html?id=${order.id}" class="btn btn-medium btn-style-1">View</a></td>
                                                        </tr>`;

                order_item_container.innerHTML += tableData;
            });

        }
    } else if (json.message === "Please log in.") {
        window.location = "sign-in.html";
    } else {
        popup.error({
            message: "Order Items Loading Failed"
        });
    }
}
///////////////////////end load orders