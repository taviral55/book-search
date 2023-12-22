const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://taviral55:Efisinsauto#5@cluster0.yd2b7s3.mongodb.net/');

module.exports = mongoose.connection;
