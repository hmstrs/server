const mongoose = require('mongoose');

const initDB = () => {

  mongoose.connect(
    process.env.MONGO,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
  );

  mongoose.connection.once('open', () => {
    console.log('connected to database');
  });

}

module.exports = initDB;
