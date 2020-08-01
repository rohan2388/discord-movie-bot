const Movie = require('../db/movie');

const Response = {
	success: (message, mv) => {
		const text = `Cool 👓`;
		message.channel.send( text )
	},
	multiple: (message ) => {
		const text = `Be more specific please 🙏`;
		message.channel.send( text );
	},
	notFound: (message, movieName) => {
		const text = `${name} is not in watchlist 🤔`;
		message.channel.send( text )
	}
}

module.exports = {
	name: 'viewed',
	help: '',
	admin: false,
	alias: ['watched'],
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
				Response.multiple(message);
			} else {
				let mv = list[0];
				await Movie.findOneAndUpdate( { 
					guild: guild,
					imdb_id: mv.imdb_id 
				}, {
					viewed: true,
					viewedDate: new Date(),
				});
				Response.success(message, mv);
			}

		} else {
			Response.notFound(message, movieName);
		}
	}
		
}