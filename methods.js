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

    'UserLocation/getWithMaxMind'(shouldSanitizeResult) {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection)
            .then((userIp) => getLocationForIpWithMaxMind(userIp, shouldSanitizeResult))
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getUserIp'() {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection);
    },

    'UserLocation/getForIp'(ip) {
        return getLocationForIpLocal(ip);
    },

    'UserLocation/getForIpWithMaxMind'(ip, shouldSanitizeResult) {
        return getLocationForIpWithMaxMind(ip, shouldSanitizeResult)
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },
});
