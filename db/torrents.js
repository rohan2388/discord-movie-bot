const { Schema, model } = require('mongoose');

const TorrentSchema = new Schema({
	id: String,
	imdb_id: {type: String, index: true },
	guild: String,
	created: { type: Date, default: Date.now },
	provider: String,
	url: String,
	name: String,
	size: Number,
	magnet: String
});


module.exports = model('Torrent', TorrentSchema);
