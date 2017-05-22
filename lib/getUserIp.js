import nodeFetch from 'node-fetch';

const GET_IP_API_ENDPOINT = 'http://bot.whatismyipaddress.com/';
const localhostIpAddress = '127.0.0.1';

export function getUserIp(isDevelopment, fetch, meteorConnection) {
    return new Promise(resolve => {
        const clientIp = meteorConnection.clientAddress;
        const isLocalIp = !clientIp || clientIp === localhostIpAddress;

        // Workaround: Meteor doesn't return the real IP but
        // 127.0.0.1 when in development
        if (isDevelopment && isLocalIp) {
            fetch(GET_IP_API_ENDPOINT)
                .then(res => res.text())
                .then((result) => resolve(result));
        } else {
            resolve(clientIp);
        }
    });
}

export default meteorConnection => getUserIp(Meteor.isDevelopment, nodeFetch, meteorConnection);
