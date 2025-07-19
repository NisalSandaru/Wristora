async function verifyAccount(){
    const verificationCode = document.getElementById("verificationCode").value;
    
    const verification ={
        verificationCode: verificationCode
    };
    
    const verificationJson = JSON.stringify(verification);
    
    const response = await fetch(
                "VerifyAccount",
                    {
                        method: "POST",
                        body: verificationJson,
                        header:{
                            "Content-type": "application/json"
                        }
                    }
            );
    
    if (response.ok) {
        const json = await  response.json();

        if (json.status) {
            window.location = "index.html";
        } else {
            if (json.message === "1") {
                window.location = "sign-in.html";
            } else {
                document.getElementById("message").innerHTML = json.message;
            }
        }
    } else {
        document.getElementById("message").innerHTML = "Verification faild!";
    }
}