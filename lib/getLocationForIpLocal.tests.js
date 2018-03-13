/* global describe, it */
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import getLocationForIp, {
    getLocationForIpLocal,
    sanitizeLocalResult } from './getLocationForIpLocal';

const fakeIp = '207.97.227.239';
const fakeResult = {
    range: [3479297920, 3479301339],
    country: 'US',
    region: 'TX',
    city: 'San Antonio',
    ll: [29.4889, -98.3987],
    metro: 641,
    zip: 78218,
    ip: '207.97.227.239',
};
const fakeSanitizedResult = {
    country_code: 'US',
    continent_code: 'NA',
    region_code: 'TX',
    city: 'San Antonio',
    latitude: 29.4889,
    longitude: -98.3987,
    ip: '207.97.227.239',
};

describe('getLocationForIpLocal(service, sanitize, ip)', () => {
    it('calls service.lookup(ip) with correct argument once', () => {
        const fakeService = { lookup: sinon.stub().returns({ foo: 'bar' }) };
        const fakeSanitize = () => {};
        getLocationForIpLocal(fakeService, fakeSanitize, fakeIp);

        assert.isTrue(fakeService.lookup.calledOnce);
        assert.isTrue(fakeService.lookup.calledWith(fakeIp));
    });

    it('getLocationForIpLocal fails if service.lookup(ip) returns null', () => {
        const fakeService = { lookup: sinon.stub().returns(null) };
        const fakeSanitize = () => {};

        assert.throws(() => {
            getLocationForIpLocal(fakeService, fakeSanitize, fakeIp);
        }, Meteor.Error);
    });

    it('calls sanitize once', () => {
        const fakeService = { lookup: sinon.stub().returns({ foo: 'bar' }) };
        const fakeSanitize = sinon.spy();
        getLocationForIpLocal(fakeService, fakeSanitize, fakeIp);

        assert.isTrue(fakeSanitize.calledOnce);
    });

    it('returns a sanitized result with ip', () => {
        const fakeService = { lookup: sinon.stub().returns({ foo: 'bar' }) };
        const fakeSanitize = a => a;
        const sanitizedResult = getLocationForIpLocal(fakeService, fakeSanitize, fakeIp);

        assert.deepEqual(sanitizedResult, { foo: 'bar', ip: fakeIp });
    });

    it('throws a Match.Error if no ip is provided', () => {
        assert.throws(getLocationForIpLocal, Match.Error);
    });
});

describe('sanitizeLocalResult(result)', () => {
    it('throws a Match.Error if no argument is provided', () => {
        assert.throws(sanitizeLocalResult, Match.Error);
    });

    it('correctly sanitizes the data', () => {
        assert.deepEqual(sanitizeLocalResult(fakeResult), fakeSanitizedResult);
    });
});

describe('getLocationForIp(ip)', () => {
    it('calls the default function and returns the correct (sanitized) result', () => {
        assert.deepEqual(getLocationForIp(fakeIp), fakeSanitizedResult);
    });
});
