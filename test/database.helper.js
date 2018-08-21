// Documented using JSDoc
// https://en.wikipedia.org/wiki/JSDoc

const mongoose = require('mongoose');
const faker = require('faker');

const { Post } = require('../app/post.model.js');
const { logInfo, logWarn, logSuccess, logError } = require('../app/logger.js');

module.exports = {
	createMockDatabase,
	deleteMockDatabase,
	getNewFakePost
};

/**
 * Populates the database with 10 records generated randomly
 * using Faker javascript library. Returns a promise which resolves
 * when this is complete.
 * @returns {Promise} promise
 */
function createMockDatabase() {
	logWarn('Seeding mock post database ...');
	const seedData = [];
	for (let i = 1; i <= 10; i++) {
		seedData.push({
			author: faker.name.firstName(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text()
		});
	}
	return Post.insertMany(seedData)
		.then(() => {
			logWarn('Mock post database created.');
		})
		.catch(err => {
			logError(err);
		});
}

/**
 * Deletes the entire database, and returns a promise which
 * resolves when this is complete.
 * @returns {Promise} promise
 */
function deleteMockDatabase() {
	return new Promise((resolve, reject) => {
		logWarn('Deleting mock database ...');
		mongoose.connection.dropDatabase()
			.then(result => {
				logWarn('Mock database deleted.');
				resolve(result);
			})
			.catch(err => {
				logError(err);
				reject(err);
			});
	});
}

/**
 * Generates a new post object generated randomly using the
 * Faker javascript library.
 * @returns {object} fakePost
 */
function getNewFakePost() {
	return {
		author: faker.name.firstName(),
		title: faker.lorem.sentence(),
		content: faker.lorem.text()
	};
}