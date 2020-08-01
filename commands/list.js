const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');

const { DateFormat, HoursFormat, WHITESPACE } = require('../inc/helper')
const Movie = require('../db/movie');



const Reponse = {
	success: (message, list) => {
		let embedsList = [];
		let description = "";
		let embed = new MessageEmbed()
						.setTitle("Watchlist")
						.setColor("#6441a3");
		
		let itemNum = 1;
		let num = 1;
		for (let mv of list) {
			let stringConcat = `**[${num}. ${mv.title}](https://www.imdb.com/title/${mv.imdb_id})** added by ${mv.submittedBy}
								**Release Date:** ${DateFormat(mv.release_date)} ${WHITESPACE} **Runtime:** ${HoursFormat(mv.runtime)} ${WHITESPACE} **Rating:** ${mv.rating}\n\n`;
		
			if ( itemNum > 10 || description.length + stringConcat.length > 2048) {
				embed.setDescription(description);
				embedsList.push(embed);
				description = "";
				itemNum = 1;
				embed = new MessageEmbed();		
			}
			
			description += stringConcat;
			num++;
			itemNum++;
		}	
		embed.setDescription(description);
		embedsList.push(embed);

		new Pagination.Embeds()
			.setArray(embedsList)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator(true)
			.setDisabledNavigationEmojis(['delete'])
			.setTitle('Watchlist')
			.setColor('#6ac045')
			.setTimeout(1000 * 15)
			.build().catch(err=>console.log(err.message));
		
	},
	empty: (message)=> {
		const text = `Watchlist is empty 🤷‍♂️`;
		message.channel.send( text );
	}
}

module.exports = {
	name: 'list',
	help: 'Get watchlist',
	admin: false,
	alias: ['watchlist', 'movies'],
	execute: async ( message, content )=>{
		const guild = message.channel.guild.id;
		const list = await Movie.find({
			guild: guild,
			viewed: false
		}).lean().exec();

		if ( list.length ) {
			Reponse.success( message, list );
		} else {
			Reponse.empty( message )
		}
	}		
}