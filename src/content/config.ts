import { defineCollection, z } from 'astro:content'

// A post is 1 markdown file in src/content/blog/.
// Add the file, commit, done. Nothing else to wire up.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keyword: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    video: z.string().url().optional(),
    sources: z.array(z.string()).optional(),
  }),
})

export const collections = { blog }
