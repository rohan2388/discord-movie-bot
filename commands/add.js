const { MessageEmbed } = require('discord.js');
const { Search, Details } = require('../service/tmdb');
const { TextPadding, DateFormat } = require('../inc/helper')
const Movie = require('../db/movie');



const MovieEmbed = (mv)=> {
	return new MessageEmbed()
	.setTitle( TextPadding(mv.title, 30) )
	.setThumbnail( mv.poster )
	.setColor("#3282b8")
	.addFields(
		{ 
			name: "Release Date", 
			value: DateFormat(mv.release_date), 
			inline: true 
		},
		{ 	
			name: "Rating", 
			value: mv.rating, 
			inline: true 
		}
	);
}

const Response = {
	success: (message, mv)=> {	
		const embed = MovieEmbed(mv);
		const text  = `Added to watchlist 😎`;
		message.channel.send( text, embed );
	},
	notFound: (message, movieName)=> {
		const text = `Sorry! Couldn't find the movie 😰 Try using an IMDB link instead? 😐`;
		message.channel.send(text);
	},
	exists: (message, mv)=> {
		const embed = MovieEmbed(mv);
		const text  = `Already in watchlist 🤨`;
		message.channel.send( text,  embed );
	},
	viewed: (message, mv) => {
		const embed = MovieEmbed(mv);
		const text  = `Already watched 😏`;
		message.channel.send( text,  embed );
	}
}

module.exports = {
	name: 'add',
	help: "Add a movie to watchlist.",
	adimin: false,
	alias: [],
	execute: async ( message, content )=>{
		if ( ! content ) return;
		const movieName = content;
		const guild = message.channel.guild.id;
		const user = message.member.user.toString();


		// Check db
		let mv = await Movie.findOne( { 
			guild: guild,
			title: { "$regex": movieName, "$options": "i" }
		}).lean().exec();

		if ( ! mv ) {
			// Search tmdb
			let tmdb_result = await Search( movieName );
			// console.log(tmdb_result)

			if ( tmdb_result.length ) {
				let movie = tmdb_result[0];
				let movieDetails = await Details( movie.id );

				movieDetails.submittedBy = user;
				movieDetails.guild = guild;
				// add it to db
				mv = new Movie( movieDetails );
				await mv.save();
				Response.success( message, mv );
			} else {
				Response.notFound( message, movieName );
			}
		} else {
			if ( mv.viewed ) {
				Response.viewed(message, mv);
			} else {
				Response.exists(message, mv);
			}
		}

	}
}