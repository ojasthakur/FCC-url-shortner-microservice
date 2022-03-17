require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan')
const connectDB = require('./db/connect')

const bodyParser = require('body-parser')


const { createUrl, findUrl } = require('./controllers/urlController')
// const multer = require('multer')
// const upload = multer()
// const { body, validationResult } = require('express-validator')
// const formData = require('express-form-data')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
// app.use(upload.array())
// app.use(formData.parse())

app.use(cors());
app.use(morgan('tiny'))
// app.use(express.urlencoded())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:code', findUrl)

app.post('/api/shorturl', createUrl)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()