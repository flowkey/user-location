/* global describe, it, beforeEach */
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import getLocationForIp, {
    lookupWithSettings,
    sanitizeMaxMindResult,
    getLocationForIpWithMaxMind,
    maxMindLookup,
} from './getLocationForIpWithMaxMind';

import { maxMindSanitizedFakeResult, maxMindFakeResult } from './maxMindFakeData';

describe('lookupWithSettings(settings, GeoIpConstructor)', () => {
    it('throws a Match.Error if required settings are missing', () => {
        const fakeSettings = {
            maxmind: {
                userId: 'user123',
                // licenseKey is missing
            },
        };
        const FakeGeoIpConstructor = () => {};

        assert.throws(() => {
            lookupWithSettings(fakeSettings, FakeGeoIpConstructor);
        }, Match.Error);
    });

    it('returns a new instance of GeoIpConstructor', () => {
        const fakeSettings = {
            maxmind: {
                userId: 'user123',
                licenseKey: 'license123',
                service: 'city',
                requestTimeout: 6000,
            },
        };
        const FakeGeoIpConstructor = sinon.spy();

        assert.isTrue(
            lookupWithSettings(fakeSettings, FakeGeoIpConstructor) instanceof FakeGeoIpConstructor
        );
        assert.isTrue(FakeGeoIpConstructor.calledWith({ ...fakeSettings.maxmind }));
        assert.isTrue(FakeGeoIpConstructor.calledWithNew());
    });
});

describe('getLocationForIpWithMaxMind(serviceLookup, sanitize, ip, shouldSanitizeResult)', () => {
    const fakeServiceLookup = sinon.spy();
    const fakeIp = '178.19.217.112';

    function callCallback(lookup, err, res) {
        const lookupArguments = lookup.getCall(0).args;
        const callback = lookupArguments[1];

        callback(err, res);
    }

    beforeEach(() => {
        fakeServiceLookup.reset();
    });

    it('throws a Match.Error if no ip is provided', (done) => {
        getLocationForIpWithMaxMind()
        .then(() => {
            done(new Error('function resolves without ip')); // is not supposed to happen
        })
        .catch(err => {
            assert.throws(() => { throw err; }, Match.Error);
            done();
        });
    });

    it('calls serviceLookup with ip and callback function', () => {
        const fakeSanitize = () => {};
        const shouldSanitizeResult = false;

        getLocationForIpWithMaxMind(fakeServiceLookup, fakeSanitize, fakeIp, shouldSanitizeResult);

        assert.isTrue(fakeServiceLookup.calledOnce);

        const callArguments = fakeServiceLookup.getCall(0).args;
        assert(fakeIp, callArguments[0]); // First parameter: ip address
        assert.isTrue(callArguments[1] instanceof Function); // Second parameter: callback function
    });

    it('rejects if the callback function passes an error', done => {
        const fakeSanitize = () => {};
        const shouldSanitizeResult = false;

        getLocationForIpWithMaxMind(fakeServiceLookup, fakeSanitize, fakeIp, shouldSanitizeResult)
        .then(() => {
            done(new Error('promise resolved even though it should not'));
        }) // Should not be called
        .catch((e) => {
            assert.throws(() => { throw e; }, Meteor.Error);
            done();
        });

        const err = new Meteor.Error();
        const res = undefined;
        callCallback(fakeServiceLookup, err, res);
    });

    it('resolves if the callback function passes a result', done => {
        const fakeSanitize = () => {};
        const shouldSanitizeResult = false;

        getLocationForIpWithMaxMind(fakeServiceLookup, fakeSanitize, fakeIp, shouldSanitizeResult)
        .then(res => {
            assert.deepEqual(res, maxMindFakeResult);
            done();
        })
        .catch((e) => {
            done(e);
        }); // Should not be called

        const err = undefined;
        const res = maxMindFakeResult;
        callCallback(fakeServiceLookup, err, res);
    });

    it('calls sanitize if shouldSanitizeResult is true', done => {
        const fakeSanitize = sinon.spy();
        const shouldSanitizeResult = true;

        getLocationForIpWithMaxMind(fakeServiceLookup, fakeSanitize, fakeIp, shouldSanitizeResult)
        .then(() => {
            assert.isTrue(fakeSanitize.calledOnce);
            assert.isTrue(fakeSanitize.calledWithExactly(maxMindFakeResult));
            done();
        })
        .catch((e) => {
            done(e);
        }); // Should not be called

        const err = undefined;
        const res = maxMindFakeResult;
        callCallback(fakeServiceLookup, err, res);
    });

    it('does not call sanitize if shouldSanitizeResult is false', done => {
        const fakeSanitize = sinon.spy();
        const shouldSanitizeResult = false;

        getLocationForIpWithMaxMind(fakeServiceLookup, fakeSanitize, fakeIp, shouldSanitizeResult)
        .then(() => {
            assert.isTrue(fakeSanitize.notCalled);
            done();
        })
        .catch((e) => {
            done(e);
        }); // Should not be called

        const err = undefined;
        const res = maxMindFakeResult;
        callCallback(fakeServiceLookup, err, res);
    });
});

describe('sanitizeMaxMindResult(result)', () => {
    it('throws a Match.Error if no argument is provided', () => {
        assert.throws(sanitizeMaxMindResult, Match.Error);
    });

    it('correctly sanitizes the data', () => {
        assert.deepEqual(sanitizeMaxMindResult(maxMindFakeResult), maxMindSanitizedFakeResult);
    });

    it('throws an error if the result is empty', () => {
        assert.throws(() => { sanitizeMaxMindResult({}); }, Meteor.Error);
    });
});

describe('maxMindLookup()', function () {
    this.timeout(5000);
    if (Meteor.isServer) {
        it('returns a result from the maxMind api (using meteor settings)', done => {
            maxMindLookup()('178.19.217.112', (err, res) => {
                if (!err && res) {
                    done();
                }
            });
        });
    }
});

describe('getLocationForIp(ip, shouldSanitizeResult)', function () {
    this.timeout(5000);
    if (Meteor.isServer) {
        it('returns a result from the maxMind api without sanitizing it', done => {
            getLocationForIp('178.19.217.112', false)
            .then(res => {
                assert.isTrue(!!res.continent);
                assert.isTrue(!!res.country);
                assert.isTrue(!!res.maxmind);
                done();
            })
            .catch(err => {
                done(err);
            });
        });

        it('returns a result from the maxMind api and sanitizes it', done => {
            getLocationForIp('178.19.217.112') // second parameter can be ommitted
            .then(res => {
                assert.deepEqual(res, maxMindSanitizedFakeResult);
                done();
            })
            .catch(err => {
                done(err);
            });
        });

        it('throws an error if the ip is incorrect', done => {
            getLocationForIp('127.0.0.0') // second parameter can be ommitted
            .then(() => {
                done(new Error('resolves with invalid ip'));
            })
            .catch(err => {
                assert.throws(() => { throw err; });
                done();
            });
        });

        it('throws an error if no ip is passed', done => {
            getLocationForIp()
            .then(() => {
                done(new Error('resolves with invalid ip'));
            })
            .catch(err => {
                assert.throws(() => { throw err; });
                done();
            });
        });
    }
});
