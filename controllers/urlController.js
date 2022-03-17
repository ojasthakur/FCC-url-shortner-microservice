const Url = require('../models/UrlModel')
const validUrl = require('valid-url')
const shortid = require('shortid')
const { findOne } = require('../models/UrlModel')
require('dotenv').config()

let urlRegex = new RegExp (/(?<=(http|https):\/\/)[^\/]+/)




const baseUrl = process.env.BASE_URL || 'http:localhost:3000/api/shorturl'

const createUrl = async (req, res) => {
    const { url: original_url } = req.body   
    // destructure the original_url from req.body.original_url
    console.log(original_url)

    // check base url if valid using the validUrl.isUri method

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('invalid base url')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()

    //check if long url is valid using the validUrl.isUri method

    if (original_url.match(urlRegex)) {
        try {
            let url = await Url.findOne({
                original_url
            })

            if (url) {
                res.json(url)
            } else {
                const shortUrl = baseUrl + '/' + urlCode
                //saving to db
                url = new Url({
                    original_url,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })
                await url.save()
                res.json({
                    original_url: url.original_url,
                    short_url: url.urlCode
                })
            }
        }catch(error) {
            console.log(error)
            res.status(500).json({ msg: 'server error' })
        }
    } else {
        res.status(401).json({error: 'Invalid URL'})
    }

}

// const createUrl = async (req, res) => {
//     let original_url = req.body.url
//     let url = await Url.create({original_url})

//     res.status(200).json({
//         msg: 'url saved to database',
//         urlObject: url
//     })
// }

const findUrl = async (req, res) => {
    try {
        
        // console.log(req.params.shortUrl)
        let url = await Url.findOne({ urlCode: req.params.code })
        if (url) {
            return res.redirect(url.original_url)
        } else {
            return res.status(404).json({msg:'url not found'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'internal server error'})
    }
}

module.exports = { createUrl, findUrl }