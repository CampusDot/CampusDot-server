const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hello. This is CampusDot')
})

app.listen(PORT, () => {
    console.log(`${PORT} port is connected!`)
})