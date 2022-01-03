const getContributors = require('./contributors')

const { Client } = require('@notionhq/client')

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const getGuide = async (id) => {
    try {
        var contributors = await getContributors()

        var payload = {
            path: `blocks/${id}/children`,
            method: `GET`,
        }
        var { results } = await notion.request(payload)
        results = results.map((result) => {
            if (result.image && result.image.type == 'external') {
                return {
                    id: result.id,
                    type: result.type,
                    image: result.image.external.url,
                    createdAt: result.created_time,
                    updatedAt: result.last_edited_time,
                }
            }
            if (result.paragraph && result.paragraph.text.length > 0) {
                return {
                    id: result.id,
                    type: result.type,
                    text: result.paragraph.text.map((block) => {
                        return {
                            content: block.plain_text,
                            link: block.href,
                            annotations: { ...block.annotations },
                        }
                    }),
                    createdAt: result.created_time,
                    updatedAt: result.last_edited_time,
                }
            }
        })
        var content = results
        var payload = {
            path: `pages/${id}`,
            method: `GET`,
        }
        var results = await notion.request(payload)
        var author = contributors.find(
            (contributor) =>
                contributor.id === results.properties.Author.relation[0].id
        )
        results = {
            id: results.id,
            title: results.properties.Name.title[0].text.content,
            description: results.properties.Description.rich_text[0]
                ? results.properties.Description.rich_text[0].text.content
                : '',
            author,
            content,
            createdAt: results.created_time,
            updatedAt: results.last_edited_time,
        }
        return results
    } catch (e) {
        return { message: 'Server error', error: e }
    }
}

module.exports = getGuide
