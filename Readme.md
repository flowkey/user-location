# User Location

This package detects the user's location based on their IP address. You can call meteor methods on the client and server to get information. See below.


## Usage

There are Meteor Methods provided that can be called from the client or server.

```js
Meteor.call('UserLocation/get', callback) // IP lookup for the connected user
Meteor.call('UserLocation/getForIp', ip, callback) // IP lookup for any ip
```

Here is a short example:

```js
Meteor.call('UserLocation/getForIp', '46.19.37.108', function (err, res) {
    console.log(err, res);
});
```

The result will be an object of this shape:

```js
{
    ip, // (Visitor's IP address, or the IP address specified in the method call)
    country_code, // (Two-letter ISO 3166-1 alpha-2 country code)
    continent_code, // (Two-letter continent code)
    region_code, // (A two-digit region code)
    city, // (Name of the city)
    latitude, // (Decimal)
    longitude, // (Decimal)
}
```

See http://dev.maxmind.com/geoip/legacy/csv/ for a more exact rundown on some of these properties. Note that many of the properties listed on that site are not available in the free version of GeoLite currently in use by this package.

## Paid maxmind service

To use the maxmind api to determine the user's location you have to provide your `userId` and `licenseKey` in your [Meteor settings](https://docs.meteor.com/api/core.html#Meteor-settings):

```js
{
    // ...
    "public": {
        // ...
    },
    "maxmind": {
        "userId": "YOUR_USER_ID",
        "licenseKey": "YOUR_LICENSE_KEY",

        // optional:
        "service": "SERVICE_TYPE_TO_USE", // The service (precision) you'd like to use: insights, city, country (default). Remember to turn off sanitization.
        "requestTimeout": 2000 // Socket read timeout in milliseconds to wait for reply from MaxMind (default: 2000)
    }
}
```

You can then call a Meteor method to retrieve the data:
```js
Meteor.call('UserLocation/getWithMaxMind`', callback);
Meteor.call('UserLocation/getForIpWithMaxMind', ip, callback);
```

The data is sanitzed to return an object similar to calling `UserLocation/getForIp`. If you want the raw object (see https://dev.maxmind.com/geoip/geoip2/web-services/#Response_Body), pass false as a parameter:
```js
const shouldSanitizeResults = false;
Meteor.call('UserLocation/getWithMaxMind', shouldSanitizeResults, callback);
Meteor.call('UserLocation/getForIpWithMaxMind', ip, shouldSanitizeResults, callback);
```

**The package does only use these credentials when the methods that are suffixed `withMaxMind` are being called.**


## HTTPS and Proxy Support

If your server uses HTTPS or an internal proxy setup (via nginx etc.), the auto-detected IP will be inaccurate. In this case you will need to configure the HTTP_FORWARDED_COUNT environment variable on the server instance.

See the `clientAddress` section at http://docs.meteor.com/#/full/meteor_onconnection for more information.

## Testing

To test the package, first add it to a meteor app (e. g. by cloning it and putting it in the packages directory). You have to install chai and sinon to the devDependencies to make the test work. You can then run the following command. Make sure to reference the settings.json, otherwise some tests won't work as expected.
`meteor test-packages ./ --driver-package practicalmeteor:mocha --settings path/to/settings.json`


## License

This package itself is licensed with a standard MIT License. The license for the maxmind GeoLite free data can be found here:

https://dev.maxmind.com/geoip/legacy/geolite/#License
