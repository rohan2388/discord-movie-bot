const moment = require('moment');
const formatDuration = require('format-duration')
const WHITESPACE = '⠀';

const Settings = require('../db/settings');

const HoursFormat = (time) => {
	return formatDuration( parseInt( time ) * 1000, {
		leading: true
	});
}

const DateFormat = date => {
	return moment(date).format("DD MMM YYYY");
}

const TextPadding =  (text, length)=> {
	let title = text;
	if ( title.length < length ) {
		let paddingAmount = length - title.length;
		for( let i=0; i < paddingAmount; i++ ) {
			title += WHITESPACE;
		}
	}
	return title;
}


const GetSettings = async (guild) => {
	let settings  = {};
	const list = await Settings.find({ guild: guild }).lean().exec();
	list.forEach(item => {
		settings[item.name] = item.value;
	});
	return settings;
}

module.exports = {
	WHITESPACE,
	TextPadding,
	DateFormat,
	HoursFormat,
	GetSettings
}