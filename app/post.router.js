const express = require('express');
const postsRouter = express.Router();

const { logInfo, logError, logSuccess, logWarn } = require('./logger.js');
const { Post } = require('./post.model.temp.js');
const { HTTP_STATUS_CODES } = require('./config.js');
const { filterObject, checkObjectProperties } = require('./helpers.js');

// ### Create ###
postsRouter.post('/', (request, response) => {
	// Checks for required fields inside request body. If any are missing, responds with an error.
	const fieldsNotFound = checkObjectProperties(['title', 'content', 'author'], request.body);
	if (fieldsNotFound.length > 0) {
		const errorMessage = `Bad Request: Missing the following fields from the request body: ${fieldsNotFound.join(', ')}`;
		logError(errorMessage);
		return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: errorMessage });
	}

	logInfo('Creating new Post document ...');
	Post
		.create({
			title: request.body.title,
			content: request.body.content,
			author: request.body.author
		})
		.then(post => {
			logSuccess('New Post document created');
			return response.status(HTTP_STATUS_CODES.CREATED).json(post);
		})
		.catch(err => {
			logError(err);
			response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
		});
});

// ### Read ###
postsRouter.get('/', (request, response) => {
	logInfo('Fetching Post collection ...');
	Post.get()
		.then(posts => {
			logSuccess('Post collection fetched succesfully');
			response.json(posts);
		}).catch(err => {
			logError(err);
			response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
		});
});

// ### Update ###
postsRouter.put('/:id', (request, response) => {
	// Checks for required fields inside request body. If any are missing, responds with an error.
	const fieldsNotFound = checkObjectProperties(['title', 'content', 'author'], request.body);
	if (fieldsNotFound.length > 2) {
		const errorMessage = `Bad Request: Missing the following fields from the request body: ${fieldsNotFound.join(', ')}`;
		logError(errorMessage);
		return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: errorMessage });
	}

	logInfo('Updating Post document ...');
	const fieldsToUpdate = filterObject(['title', 'content'], request.body);

	Post
		.update(request.params.id, fieldsToUpdate)
		.then(() => {
			logSuccess('Post document updated succesfully');
			return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
		})
		.catch(err => {
			logError(err);
			return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: 'Internal server error'});
		});
});

// ### Delete ###
postsRouter.delete('/:id', (request, response) => {
	logInfo('Deleting Post document ...');
	Post
		.delete(request.params.id)
		.then(() => {
			logSuccess('Deleted Post document succesfully');
			response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
		})
		.catch(err => {
			logError(err);
			response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
		});
});

module.exports = { postsRouter };
