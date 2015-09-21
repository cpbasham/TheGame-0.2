module.exports = {

    'googleAuth' : {
        'clientID'      : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'  : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    }

};
