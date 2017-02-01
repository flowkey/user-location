# User Location

This package detects the user's location based on their IP address. On the client:
```js
    UserLocation.get();
```
This will be filled with information retrieved from the server, once it is ready (you will get a result of `{}` until then). The result is an object with the following keys:
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


## Advanced usage

There are two Meteor Methods provided that can be called from the client or server. Both return the same location info as returned by `UserLocation.get()`, documented above.

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

## Paid maxmind service

To use the maxmind api to determine the user's location you have to provide your `userId` and `licenseKey` in your [Meteor settings](https://docs.meteor.com/api/core.html#Meteor-settings):

```js
{
    // ...
    "public": {
        // ...
    },
    "mindmax": {
        "userId": "YOUR_USER_ID",
        "licenseKey": "YOUR_LICENSE_KEY"
    }
}
```

You can then call a Meteor method to retrieve the data:
```js
Meteor.call('UserLocation/getForIpWithService', ip, callback);
```

**The package does only use these credentials when the method is being called. The Reactive Variable will always use the free, local method of determining the user's location. This behavior is intentional.**


## HTTPS and Proxy Support

If your server uses HTTPS or an internal proxy setup (via nginx etc.), the auto-detected IP will be inaccurate. In this case you will need to configure the HTTP_FORWARDED_COUNT environment variable on the server instance.

See the `clientAddress` section at http://docs.meteor.com/#/full/meteor_onconnection for more information.


## License

This package itself is licensed with a standard MIT License. The license for the maxmind GeoLite free data can be found here:

https://dev.maxmind.com/geoip/legacy/geolite/#License
