const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: true,
		trim: true,
		unique: true
	}
});

var category = mongoose.model("Category", ArticleSchema);

exports.Category = category;