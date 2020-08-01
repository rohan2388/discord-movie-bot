const {Schema, model} = require('mongoose');
const SettingsSchema = new Schema({
	id: {type: String, index: true },
	guild: {type: String, index: true },
	name: {type: String, index: true },
	updatedby: String,
	value: String,
});
module.exports = model('Settings', SettingsSchema);