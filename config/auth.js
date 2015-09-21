module.exports = {

    'googleAuth' : {
        'clientID'      : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'  : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    }

};


// https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fauth%3Fscope%3Dprofile%2Bemail%26response_type%3Dcode%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A4000%2Fauth%2Fgoogle%2Fcallback%26client_id%3D958800426876-dgjvdkrt9ms6rm7346st623hao6r5gto.apps.googleusercontent.com%26hl%3Den%26from_login%3D1%26as%3D-5705f02f16ce9efe&btmpl=authsub&hl=en
