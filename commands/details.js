const { MessageEmbed } = require('discord.js');
const { DateFormat, HoursFormat } = require('../inc/helper')
const Movie = require('../db/movie');


const Response = {
	success: (message, mv)=> {
		const embed = new MessageEmbed()
			.setTitle(mv.title)
			.setURL(`https://www.imdb.com/title/${mv.imdb_id}`)
			.setDescription(mv.overview)
			.setImage(mv.poster)
			.setColor("#6441a3")
			.addFields(
				{ name: "Release Date", value: DateFormat(mv.release_date), inline: true },
				{ name: "Runtime", value: HoursFormat(mv.runtime), inline: true },
				{ name: "Rating", value: mv.rating, inline: true }
			);

		embed.addFields(
			{ name: "Added By", value: mv.submittedBy, inline: true },
			{ name: "Added On", value: DateFormat(mv.submitted), inline: true },
			{ name: "Watched", value: mv.viewed ? DateFormat(mv.viewedDate) : "No", inline: true },
		);

		message.channel.send( embed );
	},
	
	notFound: (message, movieName) => {		
		const text = `${name} is not in watchlist 🤔`;
		message.channel.send( text );
	}
}

module.exports = {
	name: 'details',
	help: "Get movie details.",
	admin: false,
	alias: ['info'],
	execute: async ( message, content )=>{
		if ( ! content ) return;
		
		const guild = message.channel.guild.id;
		const movieName = content;

		const mv = await Movie.findOne( { 
			guild: guild,
			title: { "$regex": movieName, "$options": "i" }
		}).lean().exec();

		if ( mv ) {
			Response.success( message, mv);
		} else{
			Response.notFound(message, value);
		}
	}		
}