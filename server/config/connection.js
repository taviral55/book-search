const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shehzadamin:ccDRl6jnuMIbmeSD@cluster0.m5i1btj.mongodb.net/bookengine?retryWrites=true&w=majority');

module.exports = mongoose.connection;
