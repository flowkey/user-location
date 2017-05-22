/* global describe, it */
import { assert } from 'chai';
import sinon from 'sinon';

import { getUserIp } from './getUserIp';

describe('getUserIp(meteorConnection)', () => {
    it('returns correct ip address if not in development', async () => {
        const fetch = () => {};
        const isDevelopment = false;
        const meteorConnection = { clientAddress: '192.158.283.12' };

        const resultIp = await getUserIp(isDevelopment, fetch, meteorConnection);

        assert(resultIp, '192.158.283.12');
    });

    it('calls fetch api to get ip in development', async () => {
        const fetch = sinon.stub().resolves({ text: () => '192.158.283.12' });
        const isDevelopment = true;
        const meteorConnection = { clientAddress: '127.0.0.1' };

        await getUserIp(isDevelopment, fetch, meteorConnection);

        assert.isTrue(fetch.calledOnce);
    });
});
