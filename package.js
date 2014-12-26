Package.describe({
  name: 'flowkey:user-location',
  summary: 'Reactive user location for free',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use(["reactive-var"], "client");
  api.addFiles('user-location.js', "client");
  api.export("UserLocation");
});