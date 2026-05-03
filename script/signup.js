import { callServer } from '/dam_haji/include/call_server.js';

export async function onSignupLoad() {
    const data = await callServer("/dam_haji/server_call/user_call.php", "CHECK_LOGIN");
    if (data['is_logged_in'] === "true") {
        alert("you're already logged in");
        window.location.href = "/dam_haji/home.php";
    }
    
    document.getElementById("signupForm").addEventListener('submit', onSignupSubmit);
}

async function onSignupSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const displayName = document.getElementById('displayName').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const confPass = document.getElementById('confPass').value;

    if (username==="" || email==="" || pass==="" || confPass==="" || displayName==="") {
        alert("fill in all forms pls");
        return;
    }
    if (pass !== confPass) {
        alert("passwords do not match");
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('display_name', displayName);
    formData.append('email', email);
    formData.append('password', pass);

    const data = await callServer('/dam_haji/server_call/user_call.php', "ADD_USER", formData);
    if (data['status'] === 'success') {
        alert("user added successfully :D");
        window.location.href = "/dam_haji/login.php";
    }
    else {
        alert("oh no somting wong: "+data['error_log']+"");
    }
}