import lookupIp from 'geoip-lite';

import { sanitizeLocalResult } from './sanitizeResult';

export default function getLocationForIpLocal(ip) {
    return new Promise((resolve, reject) => {
        if (!ip) reject('No IP address provided');
        const result = lookupIp.lookup(ip);
        sanitizeLocalResult(result, ip)
            .then(resolve)
            .catch(reject);
    });
}
