
const axios = require('axios');
const querystring = require('querystring');
const ENDPOINT = "https://yts.mx/api/v2/";

const QueryURL = ( endpoint, args ) => {
	return ENDPOINT + endpoint + '?' + querystring.stringify( args );
}

const MagnetURL = (hash, name) => {
	let magnet = `magnet:?xt=urn:btih:${hash}`;
	let queryStr = querystring.stringify({
		dn: name,
		tr: [
			"udp://open.demonii.com:1337/announce",
			"udp://tracker.openbittorrent.com:80",
			"udp://tracker.coppersurfer.tk:6969",
			"udp://glotorrents.pw:6969/announce",
			"udp://tracker.opentrackr.org:1337/announce",
			"udp://torrent.gresille.org:80/announce",
			"udp://p4p.arenabg.com:1337",
			"udp://tracker.leechers-paradise.org:6969",
		]
	});
	return magnet + '&' + queryStr;
}

const GetTorrentLinks = async ( imdb_id ) => {	
	let torrentLinks = [];
	let url = QueryURL( "list_movies.json", {
		query_term: imdb_id
	});	
	const res = await axios.get(url);	
	if ( res && res.status == 200 ) {
		const status = res.data.status;
		const data = res.data.data;
		if ( status == 'ok' && data.movie_count > 0 ) {
			const movie = data.movies[0];
			if ( movie.state == 'ok' && movie.torrents.length > 0 ){
				movie.torrents.forEach(item => {
					torrentLinks.push({
						imdb_id: imdb_id,
						provider: 'yts',
						url: item.url,
						name:  `YTS - ${ item.quality }`,
						size: item.size_bytes,
						magnet: MagnetURL(item.hash, movie.title),
					});
				});
			}

		}
	}
	return torrentLinks;
}

module.exports = {
	GetTorrentLinks
}