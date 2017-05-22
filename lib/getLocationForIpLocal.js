import { Meteor } from 'meteor/meteor';
import geoIpLite from 'geoip-lite';

import continentMap from './continents';


export default function getLocationForIpLocal(ip) {
    if (!ip) throw new Meteor.Error('No IP address provided');
    const result = geoIpLite.lookup(ip);
    return sanitizeLocalResult(result, ip);
}

function sanitizeLocalResult(result, ip) {
    const correctedResult = {};

    try {
        if (!result) {
            throw new Meteor.Error('Failed to extract data from the lookup result');
        }

        correctedResult.country_code = result.country;
        correctedResult.continent_code = continentMap[correctedResult.country_code];
        correctedResult.region_code = result.region;
        correctedResult.city = result.city;
        correctedResult.latitude = result.ll && result.ll[0];
        correctedResult.longitude = result.ll && result.ll[1];
        correctedResult.ip = ip;
    } catch (e) {
        throw new Meteor.Error('Error performing lookup function', e);
    }

    return correctedResult;
}
