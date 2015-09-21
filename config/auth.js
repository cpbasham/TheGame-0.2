module.exports = {
  'facebookAuth' : {
    'clientID'      : process.env.'FACEBOOK_CLIENT_ID',
    'clientSecret'  : process.env.'FACEBOOK_CLIENT_SECRET',
    'callbackURL'   : 'http://localhost:4000/auth/facebook/callback'
  },

  'googleAuth' : {
    'clientID'      : process.env.'GOOGLE_CLIENT_ID',
    'clientSecret'  : process.env.'GOOGLE_CLIENT_SECRET',
    'callbackURL'   : 'http://localhost:4000/auth/google/callback'
  }
};
