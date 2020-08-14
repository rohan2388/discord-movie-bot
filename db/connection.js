const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const HOST = process.env.MONGO_HOST || 'localhost';
const PORT = process.env.MONGO_PORT || 27017;
const DB  	= process.env.MONGO_DB || 'moviebot';
const USER = process.env.MONGO_USER;
const PASS = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb://${USER}:${PASS}@${HOST}:${PORT}/${DB}`, {
	useNewUrlParser: true,
	useUnifiedTopology:true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(()=>{
	console.log('Database connected!');
}).catch(err => {
	console.log(`Database: ERROR => ${err.message}`);
});