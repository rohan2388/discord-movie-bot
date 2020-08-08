const { MovieDb } = require('moviedb-promise');
const { GetIMDBid } = require('../inc/helper');
const moviedb = new MovieDb( process.env.TMDB_TOKEN );


/**
 * Search movie
 * Accepts: movie name or imdb link
 */
const Search = async (movieName ) => {
	const imdb_id = GetIMDBid( movieName );
	let response;
	if ( imdb_id ) {
		response = await moviedb.find({id:imdb_id, external_source: 'imdb_id'});
	} else {
		response = await moviedb.searchMovie({ query: movieName, external_source: 'imdb_id' });
	}
	let results = imdb_id ? response.movie_results : response.results;
	let movies = [];
	if (  results.length > 0 ) {
		results.forEach(item=>{
			movies.push({
				id: item.id,
				title: item.title,
				poster: `https://image.tmdb.org/t/p/original/${item.poster_path}`,
				releaseDate: new Date( item.release_date ),
				rating: item.vote_average,	
			});
		});
	}
	return movies;
}

/**
 * Get movie details 
 */
const Details = async (movieID, done, error) => {
	let data =  await moviedb.movieInfo(movieID);
	let movieDetails = {
		id: data.id,
		imdb_id: data.imdb_id,
		title: data.title || data.original_title,
		overview: data.overview,
		genres: data.genres.map(item=> item.name),
		poster: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
		release_date: new Date( data.release_date ),
		runtime: data.runtime,
		status: data.status,
		rating: data.vote_average,
	}
	return movieDetails;
}

module.exports = { Search, Details }