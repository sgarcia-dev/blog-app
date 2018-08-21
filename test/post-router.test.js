/* global describe, before, beforeEach, afterEach, after, it */

const chai = require('chai');
const chaiHttp = require('chai-http');

const { Post } = require('../app/post.model.js');
const { startServer, closeServer, app } = require('../app/server.js');
const { MONGO_TEST_URL } = require('../app/config.js');

const { createMockDatabase, deleteMockDatabase, getNewFakePost } = require('./database.helper.js');

// allows us to type "should" instead of "chai.should" every time
const should = chai.should();
// implements chai http plugin
chai.use(chaiHttp);

describe('/api/post api tests', function () {

	before(function () {
		return startServer(MONGO_TEST_URL);
	});

	beforeEach(function () {
		return createMockDatabase();
	});

	afterEach(function () {
		return deleteMockDatabase();
	});

	after(function () {
		return closeServer();
	});

	describe('Read/GET Posts', function () {
		it('should return all existing posts', function () {
			let res;
			return chai.request(app)
				.get('/api/post')
				.then(_res => {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf.at.least(1);
					// Verify all posts were returned by comparing against Mongoose.model.count
					return Post.count();
				})
				.then(count => {
					res.body.should.have.lengthOf(count);
				});
		});

		it('should return posts with right fields', function () {
			return chai.request(app)
				.get('/api/post')
				.then(function (res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.lengthOf.at.least(1);
					// Check all returned post objects have the right fields
					res.body.forEach(function (post) {
						post.should.be.a('object');
						post.should.include.keys('id', 'title', 'content', 'author', 'created');
					});
				});
		});
	});
    
	describe('Create/POST Posts', function () {
		it('should add a new blog post', function () {
			const newPost = getNewFakePost();

			return chai.request(app)
				.post('/api/post')
				.send(newPost)
				.then(function (res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'title', 'content', 'author', 'created');
					res.body.id.should.not.be.null;
					res.body.author.should.equal(newPost.author);
					res.body.title.should.equal(newPost.title);
					res.body.content.should.equal(newPost.content);
					// To verify post was created correctly, we try to find it in the database by ID manually
					return Post.findById(res.body.id);
				})
				.then(function (post) {
					post.should.be.a('object');
					post.title.should.equal(newPost.title);
					post.content.should.equal(newPost.content);
					post.author.should.equal(newPost.author);
				});
		});
	});
    
	describe('Update/PUT Posts', function () {
		it('should update fields you send over', function () {
			const newPostData = {
				author: 'foo',
				title: 'cats cats cats',
				content: 'dogs dogs dogs'
			};
			// Step 1: Get a post to update
			return Post
				.findOne()
				.then(post => {
					post.should.be.a('object');
					newPostData.id = post.id;
					// Step 2: Update the post
					return chai.request(app)
						.put(`/api/post/${post.id}`)
						.send(newPostData);
				})
				.then(res => {
					// Step 3: Get the updated post
					return Post.findById(newPostData.id);
				})
				.then(post => {
					// Step 4: Verify changes were indeed made
					post.should.be.a('object');
					post.title.should.equal(newPostData.title);
					post.content.should.equal(newPostData.content);
					post.author.should.equal(newPostData.author);
				});
		});
	});
    
	describe('Remove/DELETE Posts', function () {
		it('should delete a post by id', function () {
			let postToDelete;
			return Post
				.findOne()
				.then(_post => {
					postToDelete = _post;
					// Step 1: Try to delete the post
					return chai.request(app).delete(`/api/post/${postToDelete.id}`);
				})
				.then(res => {
					res.should.have.status(204);
					// Step 2: Try to find the just deleted post
					return Post.findById(postToDelete.id);
				})
				.then(_post => {
					// Step 3: Verify post doesn't exist anymore
					should.not.exist(_post);
				});
		});
	});
});