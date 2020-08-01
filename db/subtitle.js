const { Schema, model } = require('mongoose');

const SubtitleSchema = new Schema({
	id: String,
	imdb_id: {type: String, index: true },
	guild: String,
	name: String,
	url: String,
	lang: String,
	rating: Number,
	created: { type: Date, default: Date.now },
});


module.exports = model('Subtitle', SubtitleSchema);
