const YSubAPI = require('yifysubtitles-api');

const Search = async ( imdb_id, lang = 'en' ) => {	
	let list = [];
	const response = await YSubAPI.search({imdbid: imdb_id, limit: 'best'});
	if ( response && response[lang] ) {
		response[lang].forEach((item)=> {
			list.push(item);
		});
	}
	return list;
}

module.exports = {
	Search,
}