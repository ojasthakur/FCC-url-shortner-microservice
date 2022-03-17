const mongoose = require('mongoose')
const shortid = require('shortid')

// const UrlSchema = new mongoose.Schema({
//     original_url: {
//         type: ,
//         required: [true, 'Please provide url to be shortened']
//     },

//     short_url: {
//         type: String,
//         default: shortid.generate
//     }
// })
const UrlSchema = new mongoose.Schema({
    urlCode: String,
    original_url: String,
    shortUrl: String,
    date: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model("Url", UrlSchema)