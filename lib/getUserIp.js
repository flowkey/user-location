import asyncHTTP from './asyncHTTP';

const GET_IP_API_ENDPOINT = 'http://bot.whatismyipaddress.com/';
const localhostIpAddress = '127.0.0.1';

export default function getUserIp(meteorConnection) {
    return new Promise((resolve, reject) => {
        const clientIp = meteorConnection.clientAddress;
        const isLocalIp = !clientIp || clientIp === localhostIpAddress;

        if (Meteor.isDevelopment && isLocalIp) {
            asyncHTTP(GET_IP_API_ENDPOINT)
                .then((result) => resolve(result.content))
                .catch(reject);
        } else {
            resolve(clientIp);
        }
    });
}
