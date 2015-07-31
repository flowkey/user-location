var Future = Npm.require("fibers/future");

Meteor.methods({
	getLocation: function () {
		// check(ip, String);
		this.unblock();
		var requestFuture = new Future();
		var ip = this.connection.clientAddress;
		// console.log("user ip", ip)
		if(!ip) throw new Meteor.Error(444, 'Ip Address could not be detected');

		HTTP.call("GET", "http://www.telize.com/geoip/"+ip+"?", function(err, result){
			if (err) return requestFuture.return(null);
			requestFuture.return(JSON.parse(result.content));
		});

		return requestFuture.wait();
	}
});
