import { Meteor } from 'meteor/meteor';
import Geoip2ws from 'geoip2ws';

import { sanitizeServiceResult } from './sanitizeResult';

const userId = Meteor.settings.maxmind.userId;
const licenseKey = Meteor.settings.maxmind.licenseKey;

const lookupIpWithService = new Geoip2ws({
    userId,
    licenseKey,
    service: 'country',
    requestTimeout: 2000,
});

export default function getLocationForIpWithService(ip) {
    return new Promise((resolve, reject) => {
        if (!userId || !licenseKey) {
            reject('You didn\'t provide either a userId or licenseKey for maxmind');
        } else {
            lookupIpWithService(ip, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const result = sanitizeServiceResult(data);
                    resolve(result);
                }
            });
        }
    });
}
