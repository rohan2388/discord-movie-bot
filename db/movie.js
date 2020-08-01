const {Schema, model} = require('mongoose');
const MovieSchema = new Schema({
	id: {type: String, index: true },
	guild: String,
	imdb_id: {type: String, index: true },
	title: String,	
	overview: String,
	genres: Array,
	poster: String,
	release_date: Date,
	runtime: Number,
	rating: Number,
	status: String,
	submittedBy: String,
	submittedDate: { type: Date, default: Date.now },
	viewed: { type: Boolean, default: false },
	viewedDate: { type: Date, default: null },
});
module.exports =  model('Movie', MovieSchema);