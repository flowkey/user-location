import { Meteor } from 'meteor/meteor';
import Geoip2ws from 'geoip2ws';


const meteorMaxMindSettings = Meteor.settings.maxmind || {};

const defaultMaxMindSettings = {
    service: 'country',
    requestTimeout: 2000,
};

const maxMindSettings = {
    ...defaultMaxMindSettings,
    ...meteorMaxMindSettings,
};
const lookupIpWithMaxMind = new Geoip2ws(maxMindSettings);


export default function getLocationForIpWithMaxMind(ip, shouldSanitizeResult = true) {
    return new Promise((resolve, reject) => {
        const { userId: maxMindUserId, licenseKey } = maxMindSettings;
        if (!maxMindUserId || !licenseKey) {
            reject(new Meteor.Error('You didn\'t provide userId or licenseKey for maxmind'));
        } else {
            lookupIpWithMaxMind(ip, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const result = shouldSanitizeResult ? sanitizeMaxMindResult(data) : data;
                    resolve(result);
                }
            });
        }
    });
}

function sanitizeMaxMindResult(result) {
    const correctedResult = {};

    try {
        correctedResult.country_code = result.country.iso_code;
        correctedResult.continent_code = result.continent.code;
        correctedResult.ip = result.traits.ip_address;
    } catch (e) {
        throw new Meteor.Error('Failed to extract data from the lookup result', e);
    }

    return correctedResult;
}
