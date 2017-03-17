import { Meteor } from 'meteor/meteor';
import lookupIp from 'geoip-lite';

import { sanitizeLocalResult } from './sanitizeResult';

export default function getLocationForIpLocal(ip) {
    if (!ip) throw new Meteor.Error('No IP address provided');
    const result = lookupIp.lookup(ip);
    return sanitizeLocalResult(result, ip);
}
