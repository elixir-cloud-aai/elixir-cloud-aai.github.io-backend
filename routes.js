const express = require('express')
const router = new express.Router()
const axios = require('axios')
const {
    getContributors,
    getGuides,
    getGuide,
    getOverview,
    getPartners,
    getProduct,
    getProducts,
} = require('./utils')

router.get('/', (req, res) => {
    res.send({ msg: 'Hello World!' })
})

router.get('/contributors', async (req, res) => {
    try {
        const data = await getContributors()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/guide/:id', async (req, res) => {
    try {
        const data = await getGuide(req.params.id)
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/guides', async (req, res) => {
    try {
        const data = await getGuides()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/news', async (req, res) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
        }
        const query = 'Covid19'
        //   "(%23elixir_cloud_aai OR %23elixircloudaai OR %23elixircloud_aai OR @ELIXIRcloud_aai has:mentions) OR ((%23cloudaai OR %23cloud_aai) (%23elixir OR %23elixireurope OR @ELIXIREurope has:mentions))";
        const nextValid = req.query.nextToken
            ? `&next_token=${req.query.nextToken}`
            : ''

        const response = await axios.get(
            `https://api.twitter.com/2/tweets/search/recent?query=${query}${nextValid}`,
            config
        )
        return res.send(response.data)
    } catch (e) {
        console.log(e)
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/overview', async (req, res) => {
    try {
        const data = await getOverview()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/partners', async (req, res) => {
    try {
        const data = await getPartners()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        const data = await getProduct(req.params.id)
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

router.get('/products', async (req, res) => {
    try {
        const data = await getProducts()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

module.exports = router
