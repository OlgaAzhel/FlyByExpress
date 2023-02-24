const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
    // Configuration object
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    },
    // The verify callback function
    // Let's use async/await!
    async function (accessToken, refreshToken, profile, cb) {
        // this callback we must:
        // Fetch the user from the database and provide them back to Passport by calling the cb() callback function, or...
        
        // If the user does not exist, we have a new user! We will add them to the database and pass along this new user in the cb() callback function.
        //we are being provided the user's profile by Google.
        
        // If we were to inspect this profile object, we'd find the following useful properties:
        //   id: The user's Google Id that uniquely identifies each Google account.
        //   displayName: The user's full name.
        //   emails: An array of email objects associated with the account.
        //   photos: An array of avatar image objects associated with the account.
        //Let's add these field to our User model's schema to hold it...
    try {
        // A user has logged in with OAuth...
        // we can use the await keyword followed by the promise.
        // When that promise is fulfilled, it will return
        // whatever the promise's resolved value is.
            let user = await User.findOne({ googleId: profile.id });
            // Existing user found, so provide it to passport
            if (user) return cb(null, user);
            // We have a new user via OAuth!
            user = await User.create({
                name: profile.displayName,
                googleId: profile.id,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

// After the verify callback function returns the user document, passport calls the passport.serializeUser() method's callback passing that same user document as an argument.

// It is the job of that callback function to return the nugget of data that passport is going to add to the session used to track the user:

passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});


//The passport.deserializeUser() method's callback function is called every time a request comes in from an existing logged in user.

// The callback needs to return what we want passport to assign to the req.user object.

passport.deserializeUser(async function (userId, cb) {
    cb(null, await User.findById(userId));
    // The above async/await code replaces this code
    // User.findById(userId).then(function(user) {
    //   cb(null, user);
    // });
});
