UserLocation = new ReactiveVar({});

UserLocation.update = function() {
    Meteor.call("UserLocation/get", function(e, res){
        if (!e && res) {
            UserLocation.set(res);
        } else {
            console.warn("It was not possible to retrive the user location");
            if (e) console.warn(e);
        }
    })
}

Meteor.startup(function() {
    UserLocation.update();
});
