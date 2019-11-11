const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the article Schema
const articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	authors: [String],
	body: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	}
});

// Create the model based on the above schema
const article = mongoose.model('Article', articleSchema);

module.exports = article;
