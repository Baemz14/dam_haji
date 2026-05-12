import { callServer } from '/dam_haji/include/call_server.js';

export function onGuestLoad() {
    document.getElementById("guestForm").addEventListener("submit", onGuestSubmit);
}

async function onGuestSubmit(e) {
    e.preventDefault()

    let displayName = document.getElementById("displayName").value;
    if (displayName === "") {
        alert("fill in the display name pls");
        return;
    }

    let formData = new FormData();
    formData.append("display_name", displayName);
    let data = await callServer('/dam_haji/server_call/user_call.php', "GUEST", formData);
    if (data['status'] === "success") {
        window.location.href = "home.php";
    } else {
        alert("guest error: " + data["error_log"]);
    }
}