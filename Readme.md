#User Location
This package will detect the user location using their IP Address.

It will save the information into a Reactive Variable:

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