/**
 * Temporary storage model, will be replaced when we switch to MongoDB
 * In the mean time, do not worry about understanding the implementation,
 * since story data this way is a terrible practice anyways.
 */

let postNumber = 1001;
const POSTS = [];

const Post = {
	get: () => new Promise((resolve, reject) => {
		resolve(POSTS);
	}),
	create: postData => new Promise((resolve, reject) => {
		const newPost = {
			id: `${postNumber}`,
			author: postData.author,
			title: postData.title,
			content: postData.content,
			created: Date.now()
		};
		POSTS.push(newPost);
		postNumber++;
		resolve(newPost);
	}),
	update: (id, newPost) => new Promise((resolve, reject) => {
		const foundPost = POSTS.find(post => post.id == id);
		if (!foundPost) {
			return reject(`no post found with id: ${id}`);
		} else {
			console.log('foundPost');
			Object.keys(newPost).forEach(prop => {
				console.log('updating propname: ' + prop);
				foundPost[prop] = newPost[prop];
			});
			resolve();
		}
	}),
	delete: id => new Promise((resolve, reject) => {
		let postIndex;
		POSTS.forEach((post, index) => {
			if (post.id == id) {
				postIndex = index;
			}
		});
        
		if (postIndex === undefined) {
			reject(`no post found with id: ${id}`);
		} else {
			POSTS.splice(postIndex, 1);
			resolve();
		}
	})
};

module.exports = { Post };
