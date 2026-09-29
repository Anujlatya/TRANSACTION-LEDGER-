const mongoose = require('mongoose');

function connectDB() {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("connected to DB");
        })
        .catch(err => {
            console.log("database is not connected : ", err)
            process.exit(1)
        })
}

module.exports = connectDB;