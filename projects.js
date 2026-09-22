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
 *   details     optional array of extra paragraphs shown only in the expanded detail panel (on click)
 *   image       optional path to a logo/screenshot shown in the card thumb
 *   link        optional live URL ("" shows noLinkLabel)
 *   noLinkLabel optional text shown instead of "PROJECT LINK COMING SOON" when link is ""
 */
window.PROJECTS = [
  {
    id: 'rstream',
    title: 'RStream',
    category: 'Mobile + Backend',
    stack: 'React Native / JavaScript / Node.js / Express / Prisma / PostgreSQL / Supabase / Render',
    image: 'assets/Rstreamlogo.png',
    description: 'Streaming application project with a React Native front end and backend work around .',
    details: [
      'RStream is a full-stack streaming application for movies, series, episodes, and live TV channels. I developed the mobile interface, backend API, database structure, authentication, video playback, favorites, watch history, search, and admin tools.',
      'One of the main challenges was handling nearly 10,000 live channels without slowing down the application. I solved this by adding pagination, search filters, and country-based navigation. I also created a consistent data structure for content coming from different sources.',
      'This project helped me gain practical experience with mobile development, REST APIs, databases, authentication, debugging, deployment, and testing on both an Android emulator and a physical device.'
    ],
    link: ''
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    category: 'HTML / CSS / JavaScript',
    stack: 'HTML / CSS / JavaScript',
    image: 'assets/RS.png',
    description: 'Personal portfolio built from scratch to practice responsive layout, interaction and front-end structure.',
    details: [
      'This portfolio website was built from scratch to showcase my skills and projects. I focused on creating a responsive layout that works well on different screen sizes, implementing interactive elements, and organizing the front-end structure for maintainability.',
      'I used HTML for the structure, CSS for styling, and JavaScript for interactivity. I also paid attention to accessibility and performance to ensure a good user experience.',
      'This project allowed me to apply my knowledge of web development and improve my skills in building modern, responsive websites.'
    ],
    link: '',
    noLinkLabel: "YOU'RE VIEWING IT"
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
