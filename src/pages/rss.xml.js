import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE } from '../config'

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft)

  return rss({
    title: `${SITE.name} blog`,
    description: 'ICM, Hermes, and systems your agent can actually use.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.slug}/`,
      })),
  })
}
