import { Meteor } from 'meteor/meteor';

import getUserIp from './lib/getUserIp';
import getLocationForIpLocal from './lib/getLocationForIpLocal';
import getLocationForIpWithMaxMind from './lib/getLocationForIpWithMaxMind';

Meteor.methods({
    'UserLocation/get'() {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection)
            .then((userIp) => getLocationForIpLocal(userIp))
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getWithMaxMind'(sanitizeResult) {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection)
            .then((userIp) => getLocationForIpWithMaxMind(userIp, sanitizeResult))
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getUserIp'() {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection)
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getForIp'(ip) {
        return getLocationForIpLocal(ip);
    },

    'UserLocation/getForIpWithMaxMind'(ip, sanitizeResult) {
        return getLocationForIpWithMaxMind(ip, sanitizeResult)
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },
});
