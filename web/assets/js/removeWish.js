async function removeWishItems(prId) {
    
    const popup = new Notification();
    
    const response = await fetch("RemoveWishItems?prId=" + prId );
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

