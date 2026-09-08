// Every link and constant the site uses. Change them here, nowhere else.

export const SITE = {
  name: 'Agents As Folders',
  domain: 'https://agentsasfolders.ai',
  // The blog is a PATH, not a subdomain. Same reason /hermes is a path:
  // 1 domain, 1 pool of authority, everything compounds on the ICM lane.
  blog: '/blog',
  tagline: 'Folders your agent can walk',
  author: 'Jordan Shaw',
}

// BuildMarketClose affiliate link. 40% commission. Disclosed at every use.
export const BMC_LINK =
  'https://www.skool.com/buildmarketclose/about?ref=b4930039368a40fea726f166eb864cc1'

export const LINKS = {
  youtube: 'https://youtube.com/@AgentsAsFolders',
  hermesGuide: 'https://profiles.agentsasfolders.ai',
  icmPaper: 'https://arxiv.org/html/2603.16021v2',
  icmRepo: 'https://github.com/RinDig/Interpretable-Context-Methodology',
  waitlistApi: '/api/waitlist',
}

export const NAV = [
  { label: 'What', href: '/#what' },
  { label: 'ICM', href: '/icm' },
  { label: 'Hermes', href: '/hermes' },
  { label: 'Start', href: '/start' },
  { label: 'Blog', href: SITE.blog },
]
