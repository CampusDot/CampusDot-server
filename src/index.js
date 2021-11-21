const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const app = express()
const PORT = 3000

require('./models/College')
require('./models/Notice')
require('./models/Review')
require('./models/Stamp')
require('./models/Store')
require('./models/StoreList')
require('./models/User')

const authRoutes = require('./routes/Auth')
const userRoutes = require('./routes/User')
const collegeRoutes = require('./routes/College')
const storelistRoutes = require('./routes/StoreList')

const requireAuth = require('./middlewares/RequireAuth')
const searchRoutes = require('./routes/Search')

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

app.use(authRoutes)
app.use(requireAuth)
app.use('/user', userRoutes)
app.use('/search', searchRoutes)
app.use('/college', collegeRoutes)
app.use('/storelist', storelistRoutes)


app.get('/', (req, res) => {
    res.send('Hello. This is CampusDot')
})

app.listen(PORT, () => {
    console.log(`${PORT} port is connected!`)
})