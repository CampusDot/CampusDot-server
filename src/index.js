const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const app = express()
const PORT = 3000

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () =>{
    console.log('Connected to mongo instance');
});
db.on('error', (err) => {
    console.log('Error connecting to mongo', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello. This is CampusDot')
})

app.listen(PORT, () => {
    console.log(`${PORT} port is connected!`)
})