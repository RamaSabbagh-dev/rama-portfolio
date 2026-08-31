const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const revealElements = document.querySelectorAll('.reveal');
const projectGrid = document.querySelector('#projectGrid');
const projectDetail = document.querySelector('#projectDetail');
const heroPhoto = document.querySelector('.hero-photo');
const photoFrame = document.querySelector('.photo-frame');
let activeProjectId = '';
let projects = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'CLOSE' : 'MENU';
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'MENU';
  });
});

revealElements.forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 220)}ms`);
});

let revealObserver = null;

if (!('IntersectionObserver' in window)) {
  revealElements.forEach(el => el.classList.add('is-visible'));
} else {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

function revealOnScroll(element) {
  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.classList.add('is-visible');
  }
}

if (heroPhoto && photoFrame && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  heroPhoto.addEventListener('pointermove', event => {
    const rect = heroPhoto.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;

    photoFrame.style.setProperty('--photo-x', `${x}px`);
    photoFrame.style.setProperty('--photo-y', `${y}px`);
  });

  heroPhoto.addEventListener('pointerleave', () => {
    photoFrame.style.setProperty('--photo-x', '0px');
    photoFrame.style.setProperty('--photo-y', '0px');
  });
}

loadProjects();

function loadProjects() {
  if (!projectGrid) return;

  projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  if (!projects.length) {
    console.error('No project data found. Is projects.js loaded before script.js?');
    projectGrid.innerHTML = '<p class="card-label">Projects could not be loaded right now.</p>';
    return;
  }

  renderProjects();
}

function renderProjects() {
  if (!projectGrid) return;

  projectGrid.innerHTML = projects.map((project, index) => `
    <article class="project-card panel project-trigger reveal" tabindex="0" role="button" aria-expanded="false" data-project-id="${escapeHtml(project.id)}">
      <div class="project-thumb">
        ${project.image ? `<img src="${escapeAttribute(project.image)}" alt="${escapeAttribute(project.title)} logo">` : ''}
      </div>
      <p class="card-label">${String(index + 1).padStart(2, '0')} / ${escapeHtml(project.category)}</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <span class="project-link">VIEW DETAILS</span>
    </article>
  `).join('');

  projectGrid.querySelectorAll('.project-trigger').forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${Math.min(index * 70, 260)}ms`);
    bindProjectCard(card);
    revealOnScroll(card);
  });

  // Page height just changed; refresh scroll-driven UI once listeners are wired.
  requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}

function bindProjectCard(card) {
  card.addEventListener('click', () => selectProject(card.dataset.projectId, card));
  card.addEventListener('pointermove', event => updateCardGlow(card, event));
  card.addEventListener('pointerleave', () => resetCardTilt(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectProject(card.dataset.projectId, card);
    }
  });
}

function updateCardGlow(card, event) {
  const rect = card.getBoundingClientRect();
  const relX = (event.clientX - rect.left) / rect.width;
  const relY = (event.clientY - rect.top) / rect.height;

  card.style.setProperty('--card-x', `${relX * 100}%`);
  card.style.setProperty('--card-y', `${relY * 100}%`);

  if (!prefersReducedMotion && event.pointerType !== 'touch') {
    card.style.setProperty('--tilt-x', `${(0.5 - relY) * 6}deg`);
    card.style.setProperty('--tilt-y', `${(relX - 0.5) * 6}deg`);
  }
}

function resetCardTilt(card) {
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
}

function selectProject(projectId, selectedCard) {
  const project = projects.find(item => item.id === projectId);

  if (!project || !projectDetail || !selectedCard) return;

  if (activeProjectId === projectId) {
    closeProjectDetail();
    return;
  }

  activeProjectId = projectId;

  document.querySelectorAll('.project-trigger').forEach(card => {
    const isActive = card.dataset.projectId === projectId;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-expanded', String(isActive));
  });
  updateProjectLabels(projectId);

  moveProjectDetail(projectId, selectedCard);

  projectDetail.classList.remove('is-changing');
  void projectDetail.offsetWidth;
  projectDetail.classList.add('is-open', 'is-changing');
  projectDetail.innerHTML = `
    <p class="card-label">${escapeHtml(project.category)}</p>
    <h3>${escapeHtml(project.title)}</h3>
    <p>${escapeHtml(project.description)}</p>
    <strong class="detail-stack">${escapeHtml(project.stack)}</strong>
    ${project.link ? `<a class="detail-link" href="${escapeAttribute(project.link)}" target="_blank" rel="noopener">OPEN PROJECT -></a>` : '<span class="detail-link">PROJECT LINK COMING SOON</span>'}
  `;
}

function closeProjectDetail() {
  if (!projectDetail) return;

  activeProjectId = '';
  projectDetail.classList.remove('is-open', 'is-changing');
  projectDetail.innerHTML = '';

  document.querySelectorAll('.project-trigger').forEach(card => {
    card.classList.remove('is-active');
    card.setAttribute('aria-expanded', 'false');
  });
  updateProjectLabels();
}

function moveProjectDetail(projectId, selectedCard) {
  if (!projectDetail) return;

  if (!projectGrid) {
    selectedCard.after(projectDetail);
    return;
  }

  const cards = [...projectGrid.querySelectorAll('.project-trigger')];
  const selectedIndex = cards.indexOf(selectedCard);

  if (selectedIndex === -1) {
    selectedCard.after(projectDetail);
    return;
  }

  const columnCount = getProjectColumnCount();
  const rowEndIndex = selectedIndex + (columnCount - 1 - (selectedIndex % columnCount));
  const insertAfterCard = cards[Math.min(rowEndIndex, cards.length - 1)] ?? selectedCard;

  insertAfterCard.after(projectDetail);
}

function getProjectColumnCount() {
  if (!projectGrid) return 1;

  const columns = getComputedStyle(projectGrid).gridTemplateColumns.trim().split(/\s+/);
  return Math.max(columns.length, 1);
}

function updateProjectLabels(openProjectId = '') {
  document.querySelectorAll('.project-trigger').forEach(card => {
    const label = card.querySelector('.project-link');

    if (label) {
      label.textContent = card.dataset.projectId === openProjectId ? 'CLICK AGAIN TO CLOSE' : 'VIEW DETAILS';
    }
  });
}

function cleanField(value) {
  return String(value ?? '').trim();
}

function escapeHtml(value) {
  return cleanField(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

/* ---------------------------------------------------------
   Scroll UI: progress bar, active nav, parallax, back-to-top
   --------------------------------------------------------- */

const scrollProgress = document.querySelector('.scroll-progress');
const toTopButton = document.querySelector('.to-top');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sectionTargets = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let scrollTicking = false;

function onScrollFrame() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  if (toTopButton) {
    toTopButton.classList.toggle('is-visible', scrollTop > 620);
  }

  if (!prefersReducedMotion) {
    document.body.style.setProperty('--scroll-y', String(scrollTop));
  }

  if (sectionTargets.length) {
    const marker = scrollTop + window.innerHeight * 0.34;
    let currentId = sectionTargets[0].id;

    sectionTargets.forEach(section => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  scrollTicking = false;
}

function requestScrollFrame() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(onScrollFrame);
}

window.addEventListener('scroll', requestScrollFrame, { passive: true });
window.addEventListener('resize', requestScrollFrame);
requestScrollFrame();

toTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});
