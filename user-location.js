import { ReactiveVar } from 'meteor/reactive-var';

export const UserLocation = new ReactiveVar({});

UserLocation.update = function (isOnStartUp) {
    if (!isOnStartUp) {
        console.warn('[user-location]: Using the ReactiveVar is deprecated and will be removed in the next major release. Use provided meteor methods instead.');
    }

    Meteor.call('UserLocation/get', (err, res) => {
        if (!err && res) {
            UserLocation.set(res);
        } else {
            console.warn('It was not possible to retrive the user location');
            if (err) console.warn(err);
        }
    });
};

Meteor.startup(() => {
    UserLocation.update(true);
});
