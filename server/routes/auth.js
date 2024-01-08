const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);

// router.use('/', (req, res, next) => {
//     console.log("this is req.user" + req.user);
//     console.log(req.user);
//     console.log(req.isAuthenticated());
//     next();
// })

router.get('/auth/google', passport.authenticate('google'));

passport.use(new GoogleStrategy({
    clientID: "746892723511-i7sge9cuimag53utdpvubsbah567fr7d.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: '/auth/google/callback',
    scope: [ 'profile', 'email' ]
},

function (accessToken, refreshToken, profile, cb) {
    const defaultUser = {
        googleID: profile.id,
        firstName: profile._json.given_name,
        familyName: profile._json.family_name,
        photoURL: profile._json.picture,
        email: profile._json.email,
        friendsID: [],
        receiveRequestID: [],
        sendRequestID: [],
        groups: []
    };

    async function main() {
        try {
            await client.connect();
            let user = await client.db('chat-app').collection('userDetails').findOne( { email: defaultUser.email } );
            if (user) {
                await client.db('chat-app').collection('userDetails').updateOne( { email: defaultUser.email }, { $set: { firstName: defaultUser.firstName, familyName: defaultUser.familyName, photoURL: defaultUser.photoURL } }, { upsert: true } );
            }
            else {
                await client.db('chat-app').collection('userDetails').insertOne( defaultUser );
            }

            user = await client.db('chat-app').collection('userDetails').findOne( { email: defaultUser.email } );
            return cb(null, user);
        } catch (e) {
            console.error(e);
            return cb(e, null);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', successRedirect: `http://localhost:3000/chats/@me` }));

passport.serializeUser((user, cb) => {
    return cb(null, user);
});

passport.deserializeUser((user, cb) => {
    console.log("I am deserializing");
    async function main() {
        try {
            await client.connect();
            const userID = await client.db('chat-app').collection('userDetails').findOne( { googleID: user.googleID } );
            return cb(null, userID);
        } catch (e) {
            console.error(e);
            return cb(e, null);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
});

module.exports = router;