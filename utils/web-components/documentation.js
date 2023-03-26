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
        const productsDB = data.results.find((result) => {
            return result.properties.title.title[0].plain_text == query
        })
        const productsDBId = productsDB.id
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
                const width = result.table.table_width
                const header = result.table.has_column_header
                payload = {
                    path: `blocks/${result.id}/children`,
                    method: `GET`,
                }
                var tableRes = await notion.request(payload)
                var tableResults = tableRes.results
                // return tableResults
                var tablefinalResults = []
                for (var j = 0; j < tableResults.length; j++) {
                    var tableResult = tableResults[j]
                    tablefinalResults = [
                        ...tablefinalResults,
                        {
                            id: tableResult.id,
                            type: tableResult.type,
                            createdAt: tableResult.created_time,
                            updatedAt: tableResult.last_edited_time,
                            cells: tableResult.table_row.cells.map((block) => {
                                return {
                                    content: block[0].plain_text,
                                    link: block[0].href,
                                    annotations: { ...block[0].annotations },
                                }
                            }),
                        },
                    ]
                }
                finalResults = [
                    ...finalResults,
                    {
                        id: result.id,
                        type: result.type,
                        table: tablefinalResults,
                        header: header,
                        width: width,
                        createdAt: result.created_time,
                        updatedAt: result.last_edited_time,
                    },
                ]
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
