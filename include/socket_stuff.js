import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { callServer } from "/dam_haji/include/call_server.js";

// We create a variable to hold the socket, but don't export it yet
let socket;

export async function initGameSocket() {
    const data = await callServer("/dam_haji/server_call/user_call.php", "GET_GAME");
    
    // Create the socket only after we have the PHP data
    socket = io("http://localhost:3000", {
        query: {
            gameData: data['game_data'],
            matchmakeData: data['matchmake_data']
        }
    });

    return socket;
}

// If other files need the socket, they call getSocket()
export const getSocket = () => socket;