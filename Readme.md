#User Location
This package will detect the user location using their IP Address.
If the lookup fails, this package will fallback to a local geoip lookup that
will only contain the county and the continent for the ip address.

You will get 2 Server Methods. Both methods will return the ip info.
	
	*  getLocation(callback) - connected users ip lookup
	*  getLocationForIp(ip, callback)

Here is a short example:

	Meteor.call('getLocationForIp', '46.19.37.108', function(err,res){
		console.log(err, res)
	})


Caution: Detecting the users IP Address could not work while wokring locally.

The package sends a client side request only if possible and saves it to a Reactive Variable:

	UserLocation.get();

	// ip (Visitor IP address, or IP address specified as parameter)
	// country_code (Two-letter ISO 3166-1 alpha-2 country code)
	// country_code3 (Three-letter ISO 3166-1 alpha-3 country code)
	// country (Name of the country)
	// region_code (Two-letter ISO-3166-2 state / region code)
	// region (Name of the region)
	// city (Name of the city)
	// postal_code (Postal code / Zip code)
	// continent_code (Two-letter continent code)
	// latitude (Latitude)
	// longitude (Longitude)
	// dma_code (DMA Code)
	// area_code (Area Code)
	// asn (Autonomous System Number)
	// isp (Internet service provider)
	// timezone (Time Zone)


This package is using the Telize Rest endpoint for achiving this.

## HTTPS and Proxy Support

If your server is using HTTPS the request is done from your server to the API endpoint. You will need to configure the HTTP_FORWARDED_COUNT enviroment variable to work properly on such a server.	