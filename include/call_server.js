export async function callServer(server_url, callState="no_state", formData=new FormData()) {
    if (formData.has('call_state')) {
        formData.set('call_state', callState);
    }
    else {
        formData.append('call_state', callState);
    }
    let response = await fetch(server_url, {
        method: 'POST',
        body: formData
    });

    let contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    } else {
        let error_text = await response.text();
        throw new Error("Server error: " + error_text);
    }
}