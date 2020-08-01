const Movie = require('../db/movie');

const Response =  {
	success: (message, mv) => {
		const text = `${mv.title} has been removed 🤐`;
		message.channel.send(text);
	},
	multiple: (message ) => {
		const text = `Be more specific please 🙏`;
		message.channel.send( text );
	},
	notFound: (message, movieName) => {
		const text = `${movieName} is not in watchlist 🤔`;
		message.channel.send( text );
	}
}


module.exports = {
	name: 'remove',
	help: 'Remove a movie from watchlist.',
	admin: false,
	alias: ['delete'],
	execute: async ( message, content )=>{
		if ( ! content ) return;
		const movieName = content;
		const guild = message.channel.guild.id;

		const list = await Movie.find( { 
			guild: guild,
			title: { "$regex": movieName, "$options": "i" }
		}).lean().exec();

		if ( list.length ) {
			if ( list.length > 1 ) {
				Response.multiple( message );
			} else {	
				const mv = list[0];
				await Movie.findOneAndRemove({
					guild: guild,
					imdb_id: mv.imdb_id
				});
				Response.success( message, mv);
			}
		} else {
			Response.notFound( message, movieName );
		}
	}
		
}