const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const HOST = process.env.MONGO_HOST || 'localhost';
const PORT = process.env.MONGO_PORT || 27017;
const DB  	= process.env.MONGO_DB || 'moviebot';

mongoose.connect(`mongodb://${HOST}:${PORT}/${DB}`, {
	useNewUrlParser: true,
	useUnifiedTopology:true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(()=>{
	console.log('Database connected!');
}).catch(err => {
	console.log(`Database: ERROR => ${err.message}`);
});