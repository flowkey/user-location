Meteor.methods({
	getLocation: function () {
		// check(ip, String);
		this.unblock();
		var ip = this.connection.clientAddress;
		console.log("user ip", ip)
		if(!ip) throw new Meteor.Error(444, 'Ip Address could not be detected');
		try {
		  var result = HTTP.call("GET", "http://www.telize.com/geoip/"+ip+"?");
		 
		  return JSON.parse(result.content);
		} catch (e) {
			console.log(e)
		  // Got a network error, time-out or HTTP error in the 400 or 500 range.
		  return false;
		}
	}
});
