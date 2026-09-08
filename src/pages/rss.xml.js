import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE } from '../config'

export async function GET(context) {
  // Same rule the post pages use: drafts are visible in dev, never in prod.
  // Filtering unconditionally here made the feed disagree with the site.
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  )

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
        link: new URL(`/blog/${post.slug}/`, SITE.domain).href,
      })),
  })
}
