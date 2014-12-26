// Write your package code here!
UserLocation = new ReactiveVar({});

Meteor.startup(function(){
		$.getJSON("http://www.telize.com/geoip?callback=?",
			function(json) {
				UserLocation.set(json);
			}
		);
});