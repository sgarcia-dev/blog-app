const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	author: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	created: { type: Date, default: Date.now }
});

postSchema.methods.serialize = function() {
	return {
		id: this._id,
		author: this.author,
		title: this.title,
		content: this.content,
		created: this.created
	};
};

const Post = mongoose.model('Post', postSchema);
module.exports = { Post };
