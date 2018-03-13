import { HTTP } from 'meteor/http';

const GET_IP_API_ENDPOINT = 'http://bot.whatismyipaddress.com/';
const localhostIpAddress = '127.0.0.1';

export function getUserIp(isDevelopment, httpGet, meteorConnection) {
    return new Promise((resolve, reject) => {
        const clientIp = meteorConnection.clientAddress;
        const isLocalIp = !clientIp || clientIp === localhostIpAddress;

        // Workaround: Meteor doesn't return the real IP but
        // 127.0.0.1 when in development
        if (isDevelopment && isLocalIp) {
            httpGet(GET_IP_API_ENDPOINT, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.content);
                }
            });
        } else {
            resolve(clientIp);
        }
    });
}

export default meteorConnection => getUserIp(Meteor.isDevelopment, HTTP.get, meteorConnection);
