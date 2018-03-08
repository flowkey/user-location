/* global describe, it */
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { getUserIp } from './getUserIp';

describe('getUserIp(meteorConnection)', () => {
    it('returns correct ip address if not in development', async () => {
        const httpGet = () => {};
        const isDevelopment = false;
        const meteorConnection = { clientAddress: '192.158.283.12' };

        const resultIp = await getUserIp(isDevelopment, httpGet, meteorConnection);

        assert(resultIp, '192.158.283.12');
    });

    it('calls fetch api to get ip in development', () => {
        const httpGet = sinon.stub().returns(() => ({ content: '192.158.283.12' }));
        const isDevelopment = true;
        const meteorConnection = { clientAddress: '127.0.0.1' };

        getUserIp(isDevelopment, httpGet, meteorConnection);
        assert.isTrue(httpGet.calledOnce);
    });
});
