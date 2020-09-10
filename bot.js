require('dotenv').config();
const Discord = require('discord.js');
const Parser = require("discord-command-parser");
const fs = require('fs');
const { GetSettings } = require('./inc/helper');

/**
 * Connect db
 */
require('./db/connection');

/**
 * Some important constants
 */
const Client = new Discord.Client();
const PREFIX = process.env.PREFIX || '!!';

/**
 * List of available commands
 */
let commandsList = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commandsList.push(command);
}

/**
 * 
 */
Client.on('ready', ()=>{
	console.log('Bot is online!');
});

/**
 * 
 */
Client.login(process.env.TOKEN);

/**
 * Handle new messages
 */
Client.on('message', async (message)=>{
	if ( message.channel.type != 'text' || ! message.content.startsWith(PREFIX) || message.author.bot ) return;
	const guild = message.channel && message.channel.guild && message.channel.guild.id ? message.channel.guild.id : '';
	if ( ! guild ) return;
	const parsed = Parser.parse(message, PREFIX);
	if ( ! parsed.success ) return;	
	const settings = await GetSettings( guild );
	
	const { command, body } = parsed;
	if ( command == 'settings' || ( settings.channel &&  settings.channel == message.channel.name ) ) {			
		const executor = commandsList.find(item=> item.name == command || ( item.alias && item.alias.includes(command) ) );
		if ( executor ) {
			if ( executor.admin && !message.member.hasPermission("ADMINISTRATOR")) {
				message.channel.send(`This command requires the user to have an administrator role in the server 🚫`);
			} else {
				executor.execute( message, body ).then(()=>{}).catch(err=>{
					message.channel.send(`⚠️ Error: ${err.message}`);
					console.log(err);
				});				
			}
		}
	}

});