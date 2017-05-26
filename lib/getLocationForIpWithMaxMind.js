import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Geoip2ws from 'geoip2ws';

export function lookupWithSettings(settings, GeoIpConstructor) {
    const meteorMaxMindSettings = settings.maxmind || {};
    const defaultMaxMindSettings = {
        service: 'country',
        requestTimeout: 2000,
    };
    const maxMindSettings = {
        ...defaultMaxMindSettings,
        ...meteorMaxMindSettings,
    };

    check(maxMindSettings, {
        service: String,
        requestTimeout: Number,
        userId: String,
        licenseKey: String,
    });

    return new GeoIpConstructor(maxMindSettings);
}

export function maxMindLookup() {
    return lookupWithSettings(Meteor.settings, Geoip2ws);
}

function getLocationForIpWithMaxMind(serviceLookup, sanitize, ip, shouldSanitizeResult = true) {
    return new Promise((resolve, reject) => {
        check(ip, String);
        serviceLookup(ip, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const result = shouldSanitizeResult ? sanitize(data) : data;
                resolve(result);
            }
        });
    });
}

export { getLocationForIpWithMaxMind };

export default (ip, shouldSanitizeResult) => (
    getLocationForIpWithMaxMind(
        maxMindLookup(),
        sanitizeMaxMindResult,
        ip,
        shouldSanitizeResult,
    )
);

export function sanitizeMaxMindResult(result) {
    check(result, Object);
    const correctedResult = {};

    try {
        correctedResult.country_code = result.country.iso_code;
        correctedResult.continent_code = result.continent.code;
        correctedResult.ip = result.traits.ip_address;
    } catch (e) {
        throw new Meteor.Error(
            '[user-location]',
            'Failed to sanitize data from the lookup result',
            e,
        );
    }

    return correctedResult;
}
