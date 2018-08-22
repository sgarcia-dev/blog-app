require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');

const { logInfo, logError, logSuccess } = require('./logger.js');
const { PORT, MONGO_URL, HTTP_STATUS_CODES } = require('./config.js');
const { localStrategy, jwtStrategy } = require('./authentication.strategy');
const { postsRouter } = require('./post.router');
const { userRouter } = require('./user.router');

const app = express();
let expressServer = null;
mongoose.Promise = global.Promise;
passport.use(localStrategy);
passport.use(jwtStrategy);

// ### MIDDLEWARE ####
app.use(morgan('[:date[web]] :method :url :status')); // http request logger
app.use(express.json()); // parses raw json request payloads
app.use(express.static('./public')); // redirects calls to matching files in ./public folder
app.use('/api/user', userRouter);
app.use('/api/post', postsRouter); // Prefixes all routes in postsRouter with /api/post 

// Route handling used to test calls against HTTP GET/POST http://localhost:8080/api/echo
app.get('/api/echo', (request, response) => {
	response.status(HTTP_STATUS_CODES.OK).json({ data: 'no data', queryParams: request.query });
});
app.post('/api/echo', (request, response) => {
	response.status(HTTP_STATUS_CODES.OK).json({ data: 'no data', queryParams: request.query, body: request.body });
});

// responds to unhandled routes
app.use('*', function (req, res) {
	res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ data: 'unhandled route' });
});

module.exports = {
	startServer,
	closeServer,
	app
};

function startServer(mongoConnectionString = MONGO_URL) {
	return new Promise((resolve, reject) => {
		logInfo('Starting mongodb connection ...');
		mongoose.connect(mongoConnectionString, { useNewUrlParser: true }, err => {
			if (err) {
				return reject(err);
			} else {
				logSuccess('Mongodb connection succesful.');
				logInfo('Starting express server ...');
				expressServer = app.listen(PORT, () => {
					logSuccess(`Express server listening on http://localhost:${PORT}`);
					resolve();
				}).on('error', err => {
					logError(err);
					mongoose.disconnect();
					reject(err);
				});
			}
		});
	});
}

function closeServer() {
	return mongoose
		.disconnect()
		.then(() => new Promise((resolve, reject) => {
			logInfo('Stopping express server ...');
			expressServer.close(err => {
				if (err) {
					logError(err);
					return reject(err);
				} else {
					logInfo('Express server stopped.');
					resolve();
				}
			});
		}));
}
