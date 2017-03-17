import { Meteor } from 'meteor/meteor';
import continentMap from './continents';

export function sanitizeLocalResult(result, ip) {
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

export function sanitizeMaxMindResult(result) {
    const correctedResult = {};

    try {
        correctedResult.country_code = result.country.iso_code;
        correctedResult.continent_code = result.continent.code;
        correctedResult.ip = result.traits.ip_address;
    } catch (e) {
        throw new Meteor.Error('Failed to extract data from the lookup result');
    }

    return correctedResult;
}
