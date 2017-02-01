import { ReactiveVar } from 'meteor/reactive-var';

export const UserLocation = new ReactiveVar({});

UserLocation.update = function () {
    Meteor.call('UserLocation/get', function (err, res) {
        if (!err && res) {
            UserLocation.set(res);
        } else {
            console.warn('It was not possible to retrive the user location');
            if (err) console.warn(err);
        }
    });
};

Meteor.startup(function () {
    UserLocation.update();
});
