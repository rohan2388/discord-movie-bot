const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');
const { TextPadding, WHITESPACE } = require('../inc/helper');
const { Search } = require('../service/subtitles');
const Movie = require('../db/movie');
const Subtitle = require('../db/subtitle');

const Response = {
	success: (message, subitles, mv) => {
		subitles.sort((a,b) => a.rating - b.rating);

		let embedsList = [];
		let embed = new MessageEmbed()
		let description = `Subtitles Links\n\n`		
		
		let itemCount = 1;
		let num = 1;
		for (let item of subitles) {

			let stringConcat = `*[${num}. ${item.name}](${item.url})*\n\n`

			if ( itemCount > 10 || description.length + stringConcat.length > 2048) {
				embed.setDescription(description);
				embedsList.push(embed);
				description = `Download Links\n\n`;
				embed = new MessageEmbed();
				itemCount = 1;
			}

			description += stringConcat;
			itemCount++;
			num++;
		}
		embed.setDescription(description);
		embedsList.push(embed);

		new Pagination.Embeds()
			.setArray(embedsList)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator(true)
			.setDisabledNavigationEmojis(['delete'])
			.setThumbnail(mv.poster)
			.setTitle(TextPadding( mv.title, 30 ))
			.setColor('#6ac045')
			.setTimeout(1000 * 15)
			.build().catch(err=>console.log(err.message));

	},
	notFound: (message) => {
		const text = `Sorry! Couldn't find subtitles 😔`;
		message.channel.send( text );
	},
	
	notInWatchlist: ( message, movieName ) => {
		const text = `${movieName} is not in watchlist 🤔`;
		message.channel.send( text );
	}
}


module.exports = {
	name: 'sub',
	help: "Get subtitles links",
	admin: false,
	alias: ['subtitle', 'subtitles'],
	execute: async ( message, content )=>{
		if ( ! content ) return;
		
		const movieName = content;
		const guild = message.channel.guild.id;

		const mv = await Movie.findOne( { 
			guild: guild,
			title: { "$regex": movieName, "$options": "i" },
			viewed: false
		}).lean().exec();

		if ( mv ) {			
			let list = await Subtitle.find( { 
				guild: guild,
				imdb_id: mv.imdb_id
			}).lean().exec();
			
			if ( ! list.length ) {
				list = await Search( mv.imdb_id );	
				if ( list.length ) {			
					let dbList = [];
					list.forEach(item=> {
						dbList.push({
							id: item.id,
							imdb_id: mv.imdb_id,
							guild: guild,						
							name: item.release,
							url: item.url,
							lang: item.lang,
							rating: item.rating,			
						});
					});
					await Subtitle.insertMany(dbList);
					list = dbList;
				}
			}

			if ( list.length ) {
				Response.success(message, list, mv);
			} else {
				Response.notFound( message );
			}
		} else {
			Response.notInWatchlist( message, movieName );
		}
	}		
}