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
    getWcGetStarted,
    getWcContribute,
    getWcCommunity,
    getWcDocs,
} = require('./utils')

router.get('/', (req, res) => {
    res.send({
        message:
            'Welcome to the Elixir Cloud & AAI API. Browse the below routes.',
        elixirCloudAai: {
            overview: {
                message: 'Get the overview page',
                path: '/overview',
            },
            contributors: {
                message: 'Get all contributors',
                path: '/contributors',
            },
            guide: {
                message: 'Get a guide by id',
                path: '/guide/:id',
            },
            guides: {
                message: 'Get all guides',
                path: '/guides',
            },
            partners: {
                message: 'Get all partners',
                path: '/partners',
            },
            product: {
                message: 'Get a product by id',
                path: '/product/:id',
            },
            products: {
                message: 'Get all products',
                path: '/products',
            },
            news: {
                message: 'Get all news',
                path: '/news',
                params: {
                    next_token: {
                        message: 'Get next page of news',
                        path: '/news?next_token=:nextToken',
                    },
                },
            },
        },
        webComponent: {
            getStarted: {
                message: 'Get all get started guides',
                path: 'wc/get-started',
            },
            community: {
                message: 'Get all community guides',
                path: 'wc/community',
            },
            contribute: {
                message: 'Get all contribute guides',
                path: 'wc/contribute',
            },
            documentation: {
                message: 'Get all documentation guides',
                path: 'wc/documentation/:query',
            },
        },
    })
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
        const query =
            '(%23elixir_cloud_aai OR %23elixircloudaai OR %23elixircloud_aai OR @ELIXIRcloud_aai has:mentions) OR ((%23cloudaai OR %23cloud_aai) (%23elixir OR %23elixireurope OR @ELIXIREurope has:mentions))'
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

router.get('/wc/get-started', async (req, res) => {
    try {
        const data = await getWcGetStarted()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})
router.get('/wc/contribute', async (req, res) => {
    try {
        const data = await getWcContribute()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})
router.get('/wc/community', async (req, res) => {
    try {
        const data = await getWcCommunity()
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})
router.get('/wc/docs/:query', async (req, res) => {
    try {
        const data = await getWcDocs(req.params.query)
        return res.send(data)
    } catch (e) {
        return res.send({ message: 'Server error', error: e })
    }
})

module.exports = router
