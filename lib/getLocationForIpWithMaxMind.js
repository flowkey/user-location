import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import Geoip2ws from 'geoip2ws';

import { sanitizeMaxMindResult } from './sanitizeResult';

const meteorMaxMindSettings = Meteor.settings.maxmind || {};

const defaultMaxMindSettings = {
    service: 'country',
    requestTimeout: 2000,
};

const maxMindSettings = _.defaults(meteorMaxMindSettings, defaultMaxMindSettings);
const lookupIpWithMaxMind = new Geoip2ws(maxMindSettings);


export default function getLocationForIpWithMaxMind(ip, sanitizeResult = true) {
    return new Promise((resolve, reject) => {
        const { userId: maxMindUserId, licenseKey } = maxMindSettings;
        if (!maxMindUserId || !licenseKey) {
            reject('You didn\'t provide userId or licenseKey for maxmind');
        } else {
            lookupIpWithMaxMind(ip, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const result = sanitizeResult ? sanitizeMaxMindResult(data) : data;
                    resolve(result);
                }
            });
        }
    });
}
