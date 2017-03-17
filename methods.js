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

    'UserLocation/getUserIp'() {
        const meteorConnection = this.connection;
        return getUserIp(meteorConnection)
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getForIp'(ip) {
        return getLocationForIpLocal(ip)
            .catch(error => {
                throw new Meteor.Error('[user-location]', error);
            });
    },

    'UserLocation/getForIpWithMaxMind'(ip, sanitizeResult) {
        return getLocationForIpWithMaxMind(ip, sanitizeResult)
            .catch(error => {
                // I don't understand this error object yet. I want to display the api errors, but am
                // not able to do that right now?!
                throw new Meteor.Error('[user-location]', error);
            });
    },
});
