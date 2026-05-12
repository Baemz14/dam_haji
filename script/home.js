import { callServer } from '/dam_haji/include/call_server.js';

export async function onHomeLoad() {
    const data = await callServer('/dam_haji/server_call/user_call.php', "CHECK_LOGIN");
    if (data['is_logged_in'] !== "true") {
        window.location.href = "/dam_haji/";
    }
    document.getElementById("displayName").innerText = data['display_name'];
}