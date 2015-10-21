Package.describe({
  name: 'flowkey:user-location',
  summary: 'Reactive user location for free',
  version: '1.0.14',
  git: 'https://github.com/flowkey/user-location.git'
});

Npm.depends({
  'geoip-lite': '1.1.6'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use(["http"],"server");
  api.use(["reactive-var"], "client");
  api.addFiles('user-location.js', "client");
  api.addFiles('server.js', "server");
  api.export("UserLocation");
});