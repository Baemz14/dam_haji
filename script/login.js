import { callServer } from '/dam_haji/include/call_server.js';

export async function onLoginLoad() {
    const data = await callServer("/dam_haji/server_call/user_call.php", "CHECK_LOGIN");
    if (data['is_logged_in'] === "true") {
        alert("you're already logged in");
        window.location.href = "home.php";
    }

    document.getElementById("showPass").addEventListener('change', function(event) {
        const checkBox = event.currentTarget;
        if (checkBox.checked) {
            document.getElementById("pass").type = "text";
        }
        else {
            document.getElementById("pass").type = "password";
        }
    });

    document.getElementById("loginForm").addEventListener("submit", onLoginSubmit);
}

async function onLoginSubmit(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const pass = document.getElementById('pass').value;

    if (username==="" || pass==="") {
        alert("fill in all forms pls");
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', pass);

    let data = await callServer('/dam_haji/server_call/user_call.php', "FIND_USER", formData);
    if (data['is_input_correct'] === "true") {
        formData.append('user_id', data['user']['user_id']);

        data = await callServer('/dam_haji/server_call/user_call.php', "LOGIN", formData);
        if (data['status'] === "success") {
            window.location.href = "home.php";
        }
        else {
            console.log("server error: "+data['error_log']);
        }
    }
    else {
        alert("wong username or password");
    }
}