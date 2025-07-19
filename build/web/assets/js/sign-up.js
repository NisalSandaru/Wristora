async function signUp() {
const firstName = $("#firstName").val();
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const user = {
        firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
        };
        
        const userJson = JSON.stringify(user);
        const response = await fetch(
            "SignUp",
                {
                    method: "POST",
                    body: userJson,
                    headers:{
                        "Content-type": "application/json"
                    },
                    body:userJson
                }
            );
    
    if(response.ok){
        const json = await response.json();
        if(json.status){
            document.getElementById("message").className = "text-success";
            document.getElementById("message").innerHTML = json.message;
            window.location = "verify-account.html";
        }else{
            document.getElementById("message").innerHTML = json.message;
        }
    }else{
        document.getElementById("message").innerHTML="Registration failed. Please try again";
    }
}