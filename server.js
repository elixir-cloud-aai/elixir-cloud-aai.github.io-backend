const express = require('express');
const app = express();
require('dotenv').config()
var cors = require('cors')

app.use(cors())

var server = require('http').createServer(app)
app.use(express.json())

const port = process.env.PORT

const routes = require('./routes')
app.use(routes);

server.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})