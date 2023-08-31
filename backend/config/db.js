const mongoose = require('mongoose');

const  connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log(`MongoDb Connected ${conn.connection.host}`)

    }catch(e){
        console.log(`Error ${e.message}`);
        process.exit();

    }

}

module.exports = connectDb;