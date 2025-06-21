const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/fcc_URL_Shortener');
        console.log('DB connected!');
    } catch (err) {
        console.log(err.message);
    }
}
connectDB();