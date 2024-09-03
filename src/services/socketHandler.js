import io from "socket.io-client";

export async function getSocketIO (endpoint, port) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV.toLowerCase() == 'development') {
        return await io(endpoint + ":" + port, {
            secure: false,
        });
    }

    //If socket server is behind a proxy
    return await io(endpoint, {
        secure: false,
        path: "/game/" + port
    });
}
