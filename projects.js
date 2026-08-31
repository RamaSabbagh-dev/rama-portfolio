/**
 * Project data for the portfolio grid.
 *
 * This is a plain script (not JSON loaded over fetch) so the site works when
 * opened directly from the file system as well as from a local/hosted server.
 * To add a project, append an object below. Fields:
 *   id          unique slug (used for the expand/collapse state)
 *   title       display name
 *   category    small label shown above the title
 *   stack       tech list shown in the expanded detail panel
 *   description one or two sentences
 *   image       optional path to a logo/screenshot shown in the card thumb
 *   link        optional live URL ("" shows "PROJECT LINK COMING SOON")
 */
window.PROJECTS = [
  {
    id: 'rstream',
    title: 'RStream',
    category: 'Mobile + Backend',
    stack: 'React Native / Node / Express / Supabase',
    description: 'Streaming application project with a React Native front end and backend work around Node, Express and Supabase.',
    link: ''
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    category: 'HTML / CSS / JavaScript',
    stack: 'HTML / CSS / JavaScript',
    description: 'Personal portfolio built from scratch to practice responsive layout, interaction and front-end structure.',
    link: ''
  },
  {
    id: 'innovative',
    title: 'Innovative',
    category: 'Web Development',
    stack: 'HTML / CSS / JavaScript',
    image: 'assets/Innovative.png',
    description: 'An AI information website with offline access, product pages, responsive design and a contact section.',
    link: 'https://ramasabbagh-dev.github.io/Innovative/'
  }
];
