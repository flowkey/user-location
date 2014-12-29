// Write your package code here!
UserLocation = new ReactiveVar({});

Meteor.startup(function(){
	if('https:' === document.location.protocol ){
		$.getJSON("http://www.telize.com/geoip?callback=?",
			function(json) {
				UserLocation.set(json);
			}
		).error(function() { 
			getLocationFromServer();
		});
	}else{
		getLocationFromServer();
	}

	function getLocationFromServer(){
		Meteor.call("getLocation", function(e, res){
			if(!e && res){
				UserLocation.set(res);
			}else{
				console.warn("It was not possible to retrive the user location");
			}
		})
	}

});