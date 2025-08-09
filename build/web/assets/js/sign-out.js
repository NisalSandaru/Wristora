async function signOut() {
    const response = await fetch("SignOut");
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                window.location = "sign-in.html";
            } else {
                window.location.reload();
            }
        } else {
            console.log("Logout Failed!");
        }
}

async function adSignOut() {
    const response = await fetch("AdSignOut");
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                window.location = "adminSign-in.html";
            } else {
                window.location.reload();
            }
        } else {
            console.log("Logout Failed!");
        }
}

