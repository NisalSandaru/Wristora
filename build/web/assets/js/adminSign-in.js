async function adminSignIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const signIn = {
        email: email,
        password: password
    };
    
    const signISON = JSON.stringify(signIn);
    
    const response = await fetch(
            "AdminSignIn",
                {
                    method: "POST",
                    body: signISON,
                    header: {
                    "Content-Type": "application/json"
                    }
                }
            );
    
    if (response.ok) { //success
        const json = await response.json();
        
        if (json.status) { // if true

                window.location = "adminDash.html";

        } else { // when enother statuse flase
            document.getElementById("message").innerHTML = json.message;
        }

    } else {
        document.getElementById("message").innerHTML = "Sign In failed. Please try again";
    }
    
}