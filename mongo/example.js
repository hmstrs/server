const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  name: String,
  date: Date,
  price: Number,
});

module.exports = mongoose.model('Example', ExampleSchema);
