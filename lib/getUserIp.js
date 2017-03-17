import fetch from 'node-fetch';

const GET_IP_API_ENDPOINT = 'http://bot.whatismyipaddress.com/';
const localhostIpAddress = '127.0.0.1';

export default function getUserIp(meteorConnection) {
    return new Promise((resolve, reject) => {
        const clientIp = meteorConnection.clientAddress;
        const isLocalIp = !clientIp || clientIp === localhostIpAddress;

        // Workaround: Meteor doesn't return the real IP but our localhostIpAddress when in development
        if (Meteor.isDevelopment && isLocalIp) {
            fetch(GET_IP_API_ENDPOINT)
                .then(res => res.text())
                .then((result) => resolve(result))
                .catch(reject);
        } else {
            resolve(clientIp);
        }
    });
}
