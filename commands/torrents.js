const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');

const { GetTorrentLinks } = require('../service/yts');
const { TextPadding, WHITESPACE } = require('../inc/helper');
const Torrents = require('../db/torrents');
const Movie = require('../db/movie');



const Response = {
	success: (message, list, mv) => {
		let embedsList  = [];
		let embed = new MessageEmbed()
		let description = `Download Links\n\n`;
		let num = 0;

		for (let item of list) {
			num++;			
			let stringConcat = `**${num}. ${item.name}**
								*[Download](${item.url})*
								${item.magnet}\n\n`;

			if ( description.length + stringConcat.length > 2048) {
				embed.setDescription(description);
				embedsList.push(embed);
				description = `Download Links\n\n`;
				embed = new MessageEmbed();
			}
			description += stringConcat;
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
		const text = `Sorry! Couldn't find torrents 😔`;
		message.channel.send( text );
	},

	notInWatchlist: (message, movieName)=> {
		const text = `${movieName} is not in watchlist 🤔`;
		message.channel.send( text );
	}
}

module.exports = {
	name: 'torrents',
	help: "Get movie download links",
	admin: false,
	alias: ['torrent', 'download', 'dl'],
	execute: async ( message, content )=>{
		if ( ! content ) return;
		
		const movieName = content;
		const guild = message.channel.guild.id;
		
		const mv = await Movie.findOne( { 
			guild: guild,
			title: { "$regex": movieName, "$options": "i" }
		}).lean().exec();

		if ( mv ) {
			let list = await Torrents.find( { 
				guild: guild,
				imdb_id: mv.imdb_id
			}).lean().exec();

			if ( ! list.length ){
				list = await GetTorrentLinks( mv.imdb_id );	
				if ( list.length ) {
					let dbList = list.map(item=> {
						item.imdb_id = mv.imdb_id;
						item.guild = guild;
						return item;
					});
					await Torrents.insertMany(dbList);
				}
			}

			if ( list.length ) {
				Response.success(message, list, mv);
			} else {
				Response.notFound( message );
			}

		} else {
			Response.notInWatchlist(message, movieName);
		}
	}		
}