const Settings = require('../db/settings');

const ParseCommand = (str) => {
	const match = str.match(/--([\w]+)+\s+(.*)/i);
	if ( match && match.length === 3 ) {
		const name = match[1] ? match[1].trim() : '';
		const value = match[2] ? match[2].trim() : '';
		return {name, value};
	}
	return false;
}

const Reponse = {
	success: (message) => {		
		const text = `Updated ✔️`; 
		message.channel.send(text);
	},
	error: (message) => {		
		const text = `Error ⚠️`;
		message.channel.send(text);
	},
}


module.exports = {
	name: 'settings',
	help: 'Update bot settings. e.g. `!!settings --channel channel-name`',
	admin: true,
	alias: [],
	execute: async ( message, content )=>{		
		if  ( ! content ) return; 
		const guild = message.channel.guild.id;
		const user = message.member.user.toString();
		const {name, value} = ParseCommand(content);
		if ( name && value ) {
			let update = {
				name: name,
				value: value,
				updatedby: user,
			}
			await Settings.findOneAndUpdate( 
				{ guild: guild, name: name }, update, { upsert: true }
			)
			Reponse.success(message);
		} else {
			Reponse.error( message );
		}
	}		
}