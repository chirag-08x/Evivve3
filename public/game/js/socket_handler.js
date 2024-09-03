function getSocketIO (endpoint, port) {
    if (isLocalhost()) {
        //For local setup
        //Comment out if using staging setup
        return io(endpoint + ":" + port, {
              forceNew: true,
              pingInterval: 5000,
              pingTimeout: 5000
        });
    } else {
        //For staging
        //Comment out if using local setup
        return io(endpoint, {
              forceNew: true,
              pingInterval: 5000,
              pingTimeout: 5000,
              path: "/game/" + port
        });
    }

    //TODO: The above requirement for configuration
    //is bad, use webpack or something else to setup
    //front-end configuration for "game" module
}
