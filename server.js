import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Future } from 'fibers/future';
import geoip from 'geoip-lite';

import continentMap from './lib/continents';

const GET_IP_ADDRESS_API_ENDPOINT = 'http://bot.whatismyipaddress.com/';
const localhostIpAddress = '127.0.0.1';

Meteor.methods({
    'UserLocation/get'() {
        const userIp = getUserIp.call(this);
        return getLocationForIp(userIp);
    },

    'UserLocation/getForIp'(ip) {
        return getLocationForIp(ip);
    },

    'UserLocation/getUserIp'() {
        return getUserIp.call(this);
    },
});

function getUserIp() {
    let ip = this.connection.clientAddress;
    const isLocalIp = Meteor.isDevelopment && (!ip || ip === localhostIpAddress);
    if (isLocalIp) {
        try {
            this.unblock();
            ip = HTTP.get(GET_IP_ADDRESS_API_ENDPOINT).content;
        } catch (e) {
            throw new Meteor.Error('[user-location] Couldn\'t get user IP');
        }
    }
    return ip;
}

function getLocationForIp(ip) {
    if (!ip) throw new Meteor.Error('[user-location] No IP address provided');

    const correctedResult = {};
    const result = geoip.lookup(ip);

    try {
        if (result) {
            correctedResult.country_code = result.country;
            correctedResult.region_code = result.region;
            correctedResult.city = result.city;
            correctedResult.latitude = result.ll && result.ll[0];
            correctedResult.longitude = result.ll && result.ll[1];
            correctedResult.continent_code = continentMap[correctedResult.country_code];
        } else {
            throw new Meteor.Error('[user-location] Failed to extract data from the lookup result');
        }
    } catch (e) {
        throw new Meteor.Error('[user-location] Error performing lookup function', e);
    }

    return correctedResult;
}
