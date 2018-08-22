'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('./user.model');
const { JWT_SECRET } = require('./config');

// For more on how Passport authentication works using strategies, see:
// http://www.passportjs.org/docs/configure/
const localStrategy = new LocalStrategy((username, password, passportVerify) => {
	let user;
	// Step 1: Verify the username exists
	User.findOne({ username: username }).then(_user => {
		user = _user;
		if (!user) {
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		// Step 2: Compare the user's password against the stored password hash by running it against the same algorithm
		return user.validatePassword(password);
	}).then(isValid => {
		if (!isValid) {
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		// Step 3: Authentication succesful
		return passportVerify(null, user);
	}).catch(err => {
		if (err.reason === 'LoginError') {
			return passportVerify(null, false, err);
		}
		return passportVerify(err, false);
	});
});

const jwtStrategy = new JwtStrategy(
	{
		secretOrKey: JWT_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
		algorithms: ['HS256']
	},
	(token, done) => {
		done(null, token.user);
	}
);

module.exports = { localStrategy, jwtStrategy };