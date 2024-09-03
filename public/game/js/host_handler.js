const strIncludes = (str, arr) => arr.reduce((acc, val) => acc || str.includes(val), false);

const isEvivve2 = () => window.location.href.includes('/evivve2');
const isEvivve3 = () => window.location.href.includes('/evivve3');

const isPreProduction = () => strIncludes(window.location.hostname, ['pre-app', 'pre-production']);
const isLocalhost = () => strIncludes(window.location.hostname, ['localhost', '127.0.0.1', '100.113.46.92', '100.82.143.116']);
const isStaging = () => strIncludes(window.location.hostname, ['staging']);

const getCurrentHost = () => {
    if (isLocalhost())
        return "localhost";
    else if (isStaging())
        return "staging";
    else if (isPreProduction())
        return "pre"
    else
        return "production";
}

const EV2HostConf = {
    localhost: {socket: `http://${window.location.hostname.split(':')[0]}`, docker: `http://${window.location.hostname.split(':')[0]}:4440`}, //localhost
    staging: {socket: 'https://staging-test.evivve.com', docker: 'https://staging-test.evivve.com'},
    production: {socket: 'https://production.evivve.com', docker: 'https://production.evivve.com'},
    pre: {socket: 'https://pre-production.evivve.com', docker: 'https://pre-production.evivve.com'},
};

const EV3HostConf = {
    localhost: {socket: `http://${window.location.hostname.split(':')[0]}`, docker: `http://${window.location.hostname.split(':')[0]}:4440`}, //localhost
    staging: {socket: 'https://staging-gameside.evivve.com', docker: 'https://staging-gameside.evivve.com'},
    production: {socket: 'https://gameside.evivve.com', docker: 'https://gameside.evivve.com'},
    pre: {socket: 'https://gameside.evivve.com', docker: 'https://gameside.evivve.com'},
};

function getHost (host_type) {
    if (!['docker', 'socket'].includes(host_type))
        throw new Error("'host_type' value provided is invalid");

    let conf = null;
    if (isEvivve2())
        conf = EV2HostConf;
    else if (isEvivve3())
        conf = EV3HostConf;
    else
        throw new Error("Cannot identify Evivve version");

    return conf[getCurrentHost()][host_type];
}
