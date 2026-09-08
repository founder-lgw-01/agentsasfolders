import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://agentsasfolders.ai',
  // /thanks/ is a form landing page, not content. Keep it out of the index.
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks/') })],
  output: 'static',
})
