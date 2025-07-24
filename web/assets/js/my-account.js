//window.addEventListener("load",async function (){
//    const response = await fetch("MyAccount");
//});


function loadData() {
    getUserData();
    getCityData();
}

async function getUserData() {
    const response = await fetch("MyAccount");
    if (response.ok) {
        const json = await response.json();
        document.getElementById("shipping_fname").value = json.firstName;
        document.getElementById("shipping_lname").value = json.lastName;
        document.getElementById("mobile").value = json.mobile;
        document.getElementById("currentPassword").value = json.password;
        
        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {
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
                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                mobile = address.mobile;
                city = address.city.name;
//                district = address.city.district.name;
                postalCode = address.postalCode;
                cityId = address.city.id;

                const line = document.createElement("li");

                line.innerHTML = lineOne + ", " + "<br/>" +
                        lineTwo + ", " + "<br/>" + city + ". " + "<br/>" + postalCode;

                addressUL.appendChild(line);

            });
            document.getElementById("addName").innerHTML = `Name : ${json.firstName} ${json.lastName}`;
            document.getElementById("addEmail").innerHTML = `Email : ${email}`;
            document.getElementById("contact").innerHTML = `Phone : ${json.mobile}`;

//            console.log(lastAddress);
            document.getElementById("lineOne").value = lineOne;
            document.getElementById("lineTwo").value = lineTwo;
            document.getElementById("postalCode").value = postalCode;
            document.getElementById("citySelect").value = parseInt(cityId); //parseInt()
        }
        
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

async function saveChanges() {

const popup = new Notification();

    const firstName = document.getElementById("shipping_fname").value;
    const lastName = document.getElementById("shipping_lname").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const cityId = document.getElementById("citySelect").value;
    const mobile = document.getElementById("mobile").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        postalCode: postalCode,
        cityId: cityId,
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
        document.getElementById("message").innerHTML = "Profile details update fail!";
        document.getElementById("message").classList.remove("text-success");
        document.getElementById("message").classList.add("text-danger");
    }
}