const { Client } = require('@notionhq/client')

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const getWcDocs = async (query) => {
    try {
        var payload = {
            path: `search`,
            method: `POST`,
            body: {
                query,
            },
        }
        var data = await notion.request(payload)
        const productsDBId = data.results[0].id
        payload = {
            path: `blocks/${productsDBId}/children`,
            method: `GET`,
        }
        var { results } = await notion.request(payload)
        var finalResults = []
        for (var i = 0; i < results.length; i++) {
            var result = results[i]
            if (result.image && result.image.type == 'external') {
                finalResults = [
                    ...finalResults,
                    {
                        id: result.id,
                        type: result.type,
                        image: result.image.external.url,
                        createdAt: result.created_time,
                        updatedAt: result.last_edited_time,
                    },
                ]
                continue
            }
            if (result.type == 'divider') {
                finalResults = [
                    ...finalResults,
                    {
                        id: result.id,
                        type: result.type,
                        createdAt: result.created_time,
                        updatedAt: result.last_edited_time,
                    },
                ]
                continue
            }
            if (result.type == 'table') {
                // finalResults = [...finalResults, {}]
                // payload = {
                //     path: `blocks/${result.id}/children`,
                //     method: `GET`,
                // }
                // var { tableResults } = await notion.request(payload)
                // console.log(tableResults)
                continue
            }
            finalResults = [
                ...finalResults,
                {
                    id: result.id,
                    type: result.type,
                    text: result[result.type].text.map((block) => {
                        return {
                            content: block.plain_text,
                            link: block.href,
                            annotations: { ...block.annotations },
                        }
                    }),
                    createdAt: result.created_time,
                    updatedAt: result.last_edited_time,
                },
            ]
        }
        return finalResults
    } catch (e) {
        console.log(e)
        return { message: 'Server error', error: e }
    }
}

module.exports = getWcDocs
