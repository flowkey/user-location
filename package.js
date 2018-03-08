Package.describe({
    name: 'flowkey:user-location',
    summary: 'Reactive user location for free',
    version: '2.1.0',
    git: 'https://github.com/flowkey/user-location.git',
});

Npm.depends({
    'geoip-lite': '1.2.1',
    geoip2ws: '1.8.8',
});

Package.onUse(function (api) {
    api.use('ecmascript');
    api.versionsFrom('1.4.2.3');
    api.mainModule('user-location.js', 'client');
    api.mainModule('server.js', 'server');
    api.export('UserLocation');
});


Package.onTest((api) => {
    api.use([
        'ecmascript',
        'cultofcoders:mocha',
        'practicalmeteor:chai',
        'practicalmeteor:sinon',
    ]);
    api.mainModule('user-location.tests.js');
});
