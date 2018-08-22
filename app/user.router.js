const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { logInfo, logWarn, logError, logSuccess } = require('./logger');
const { JWT_EXPIRY, JWT_SECRET, HTTP_STATUS_CODES } = require('./config');
const { checkObjectProperties, filterObject, newUsernameValid, newPasswordValid } = require('./helpers.js');

const { User } = require('./user.model');
const userRouter = express.Router();

const localPassportMiddleware = passport.authenticate('local', {session: false});
const jwtPassportMiddleware = passport.authenticate('jwt', {session: false});

userRouter.post('/login', localPassportMiddleware, (request, response) => {
	const authToken = createJwtToken(request.user.serialize());
	response.json({authToken});
});

userRouter.post('/refresh', jwtPassportMiddleware, (request, response) => {
	const authToken = createJwtToken(request.user);
	response.json({ authToken });
});

userRouter.post('/', (request, response) => {
	// Checks for required fields inside request body. If any are missing, responds with an error.
	const fieldsNotFound = checkObjectProperties(['username', 'password'], request.body);
	if (fieldsNotFound.length > 0) {
		const errorMessage = `ValidationError: Missing the following fields from the request body: ${fieldsNotFound.join(', ')}`;
		logError(errorMessage);
		return response.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
			error: errorMessage
		});
	}
	// Checks user and password are valid, otherwise returns an error
	const usernameValidation = newUsernameValid(request.body.username);
	if (!usernameValidation.isValid) {
		logError(usernameValidation.reason);
		return response.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
			error: usernameValidation.reason
		});
	}
	const passwordValidation = newPasswordValid(request.body.password);
	if (!passwordValidation.isValid) {
		logError(passwordValidation.reason);
		return response.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
			error: passwordValidation.reason
		});
	}
  
	const newUser = filterObject(['username', 'password', 'name'], request.body);
	// Step 1: Verify another user with the same username doesn't exist
	return User.find({ username: newUser.username })
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({ error: 'ValidationError: Username already taken' });
			}
			// Step 2: Once sure another user doesn't exist, create a password hash to store
			return User.hashPassword(newUser.password);
		})
		.then(hash => {
			// Step 3: Create user using hashed password
			return User.create({
				username: newUser.username,
				password: hash,
				name: newUser.name
			});
		})
		.then(user => {
			// Step 4: Return user creation confirmation
			return response.status(201).json(user.serialize());
		})
		.catch(err => {
			if (err.error && err.error.includes('ValidationError')) {
				return response.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json(err);
			}
			response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: 'Internal server error'});
		});
});

module.exports = { userRouter };

function createJwtToken(user) {
	return jwt.sign({user}, JWT_SECRET, {
		subject: user.username,
		expiresIn: JWT_EXPIRY,
		algorithm: 'HS256'
	});
}