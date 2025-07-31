async function removeCartItems(prId) {
    
    const popup = new Notification();
    
    const response = await fetch("RemoveCartItems?prId=" + prId );
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            popup.success({
                message: json.message
            });
            window.location.reload();
        } else {
            popup.error({
                message: "Something went wrong. Try again"
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}

