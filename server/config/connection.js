const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://taviral55:Efisinsauto5@cluster0.yd2b7s3.mongodb.net/bookengine?retryWrites=true&w=majority');

module.exports = mongoose.connection;
