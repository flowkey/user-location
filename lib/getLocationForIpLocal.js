import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import geoIpLite from 'geoip-lite';

import continentMap from './continents';


export function getLocationForIpLocal(service, sanitize, ip) {
    check(ip, String);

    const lookupResult = service.lookup(ip);
    if (!lookupResult) throw new Meteor.Error('[user-location]', 'No result from lookup service');

    const result = {
        ...lookupResult,
        ip,
    };

    return sanitize(result);
}

export default function (ip) {
    return getLocationForIpLocal(geoIpLite, sanitizeLocalResult, ip);
}

export function sanitizeLocalResult(result) {
    check(result, Object);

    return {
        country_code: result.country,
        continent_code: continentMap[result.country],
        region_code: result.region,
        city: result.city,
        latitude: result.ll && result.ll[0],
        longitude: result.ll && result.ll[1],
        ip: result.ip,
    };
}
