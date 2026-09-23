import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const styleVersion = createHash('sha256').update(await readFile(path.join(root, 'css/style.css'))).digest('hex').slice(0, 12);
const scriptVersion = createHash('sha256').update(await readFile(path.join(root, 'js/script.js'))).digest('hex').slice(0, 12);
const projects = JSON.parse(await readFile(path.join(root, 'data/projects.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const arrow = (direction = '↗') => `<span class="arrow" aria-hidden="true">${direction}</span>`;
const tags = items => `<ul class="tags" aria-label="Topics and tools">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
const meta = project => `<div class="project-meta"><span class="project-number">${escape(project.index)}</span><span class="project-meta-separator" aria-hidden="true"></span><span>${escape(project.categoryLabel)}</span></div>`;

function head(title, description, prefix = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#f6f5f0">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <title>${escape(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${prefix}images/favicon.svg">
  <link rel="stylesheet" href="${prefix}css/style.css?v=${styleVersion}">
  <script src="${prefix}js/script.js?v=${scriptVersion}" defer></script>
</head>`;
}

function header(prefix = '') {
  const home = prefix ? `${prefix}index.html` : '';
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="header-inner wrap">
    <a class="brand" href="${home || '#top'}" aria-label="Jili You home"><span class="monogram" aria-hidden="true">JY</span><span>Jili You</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-navigation">Menu <span aria-hidden="true">☰</span></button>
    <nav class="site-nav" id="site-navigation" aria-label="Main navigation">
      <a href="${prefix}resume.pdf">Resume</a><a href="${home}#projects">Work</a><a href="${home}#about">About</a><a class="nav-contact" href="${home}#contact">Contact ${arrow()}</a>
    </nav>
  </div>
</header>`;
}

function footer(prefix = '') {
  return `<footer class="site-footer"><div class="footer-inner wrap"><span>© <span data-year>2026</span> Jili You</span><span class="footer-credit">Made with curiosity &amp; code.</span><a href="#top">Back to top ${arrow('↑')}</a></div></footer>`;
}

function card(project, index) {
  return `<article class="project-card${project.featured ? ' project-card-featured' : ''}" data-category="${escape(project.category)}" data-slug="${escape(project.slug)}" data-reveal>
  <a class="project-link" href="projects/${escape(project.slug)}.html" aria-labelledby="action-${escape(project.slug)} title-${escape(project.slug)}">
    <div class="project-image"><img src="${escape(project.image)}" alt="${escape(project.imageAlt)}" loading="lazy" decoding="async">${index === 0 ? '<span class="project-card-label">In the lab</span>' : ''}</div>
    <div class="project-info">${meta(project)}
      <div class="project-title-row"><h3 id="title-${escape(project.slug)}">${escape(project.title)}</h3></div>
      <p class="project-summary">${escape(project.summary)}</p>${tags(project.tags)}
      <span class="project-cta"><span id="action-${escape(project.slug)}">View project</span>${arrow('→')}</span>
    </div>
  </a>
</article>`;
}

function projectPhotos(project) {
  const caption = project.slug === 'portfolio' ? 'An earlier version of this portfolio.' : project.imageAlt;
  if (!project.gallery?.length) {
    return `<figure class="detail-image"><a href="../${escape(project.image)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size project image"><img src="../${escape(project.image)}" alt="${escape(project.imageAlt)}" fetchpriority="high"></a></figure>
    <div class="detail-caption"><span>${escape(caption)}</span><a href="../${escape(project.image)}" target="_blank" rel="noopener noreferrer">View full image ${arrow()}</a></div>`;
  }
  const photos = [{ image: project.image, imageAlt: project.imageAlt }, ...project.gallery];
  return `<div class="project-photos" data-photo-slider role="region" aria-label="Project photos" aria-roledescription="carousel">
    <figure class="detail-image">
      <button class="photo-stage" type="button" data-photo-advance aria-label="Next photo (currently 1 of ${photos.length})" disabled>
        ${photos.map((photo, index) => `<span class="photo-slide" data-photo-slide data-photo-src="../${escape(photo.image)}" data-photo-caption="${escape(photo.imageAlt)}"${index === 0 ? '' : ' hidden'}><img src="../${escape(photo.image)}" alt="${escape(photo.imageAlt)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`).join('\n        ')}
      </button>
      <figcaption class="detail-caption"><span data-photo-caption-text>${escape(caption)}</span><a href="../${escape(project.image)}" data-photo-full target="_blank" rel="noopener noreferrer">View full image ${arrow()}</a></figcaption>
    </figure>
    <div class="photo-controls" data-photo-controls hidden>
      <button type="button" data-photo-prev aria-label="Previous photo">${arrow('←')}</button>
      <span class="photo-status" data-photo-status role="status" aria-live="polite" aria-atomic="true">1 / ${photos.length}</span>
      <button type="button" data-photo-next aria-label="Next photo">${arrow('→')}</button>
    </div>
  </div>`;
}

const categories = [['all', 'All work'], ['engineering', 'Engineering'], ['machine-learning', 'Machine learning'], ['research', 'Research'], ['web', 'Web']];
const filters = categories.map(([id, label]) => `<button class="filter" type="button" data-filter="${id}" aria-pressed="${id === 'all'}" aria-controls="project-grid">${label}${id === 'all' ? `<span class="filter-count">${String(projects.length).padStart(2, '0')}</span>` : ''}</button>`).join('');
const toolIcons = [
  ['Python', 'python.png'],
  ['PyTorch', 'Pytorch.webp', 'tool-symbol-pytorch'],
  ['SolidWorks', 'solidworks1.png'],
  ['Fusion 360', 'Autodesk_Fusion_360.webp'],
  ['KiCad', 'kicad.svg'],
  ['MATLAB', 'Matlab.png'],
  ['MetaMorph', 'metamorph.png', 'tool-symbol-metamorph'],
  ['Microsoft Office', 'office.webp'],
];

const index = `${head('Jili You — Engineering, Research & Code', 'The personal portfolio of Jili You. Explore projects in mechanical engineering, machine learning, and biomedical research.')}
<body id="top">
${header()}
<main id="main">
  <section class="hero wrap" id="about" aria-labelledby="hero-title">
    <div class="hero-grid">
      <div class="hero-intro">
        <h1 id="hero-title">Jili You</h1>
        <div class="hero-bio">
          <p>Hello! I am a third-year Mechanical Engineering student at the University of Toronto. I have a strong passion for machine learning, automotive design, and the integration of biomedical and mechanical fields.</p>
          <p>I enjoy applying technical knowledge and problem-solving skills to tackle real-world challenges. Through my projects both in and outside class, I have gained proficiency in Python, PyTorch, and SolidWorks.</p>
          <p>I look forward to applying my skills and passion to contribute to pioneering projects and innovations in mechanical engineering design and biomedical applications.</p>
        </div>
      </div>
      <figure class="portrait">
        <div class="portrait-frame"><img src="images/jili-you.jpg" alt="Portrait of Jili You" width="1280" height="1920" fetchpriority="high"></div>
      </figure>
    </div>
    <div class="toolbox" aria-labelledby="toolbox-title"><h2 class="toolbox-label" id="toolbox-title">Tools &amp; Technologies</h2><ul class="tool-list">${toolIcons.map(([label, file, symbolClass = '']) => `<li title="${escape(label)}"><span class="tool-symbol ${symbolClass}"><img src="images/icons/${escape(file)}" alt="${escape(label)}" width="56" height="56" loading="lazy" decoding="async"></span></li>`).join('')}</ul></div>
  </section>

  <section class="work-section" id="projects" aria-labelledby="work-title">
    <div class="wrap">
      <div class="section-topline"><p class="eyebrow">01 / A selection of projects</p></div>
      <div class="section-heading"><h2 id="work-title">Ideas put into practice.</h2></div>
      <div class="project-filters" role="group" aria-label="Filter projects" hidden>${filters}</div>
      <div class="project-grid" id="project-grid">${projects.map(card).join('\n')}</div>
    </div>
  </section>

  <section class="contact-section wrap" id="contact" aria-labelledby="contact-title">
    <div class="contact-grid">
      <div><h2 id="contact-title">Let’s <em>connect</em></h2><p class="contact-note">Have a project in mind? I’d love to hear from you.</p></div>
      <div><a class="contact-email" href="mailto:jili.you@mail.utoronto.ca">jili.you@mail.utoronto.ca ${arrow()}</a><div class="contact-links"><a href="https://github.com/to0ommy" target="_blank" rel="noopener noreferrer">GitHub ${arrow()}</a><button class="copy-button" type="button" data-copy-email hidden>Copy email <span aria-hidden="true">⧉</span></button></div><span class="copy-status" role="status" aria-live="polite"></span></div>
    </div>
  </section>
</main>
${footer()}
<noscript><style>.menu-toggle{display:none}.site-nav{display:flex;position:static;padding:0;border:0;box-shadow:none;flex-direction:row;gap:12px}.header-inner{flex-wrap:wrap;padding-block:12px}.site-nav .nav-contact{border:0;padding:12px 0}</style></noscript>
</body>
</html>
`;

await mkdir(path.join(root, 'projects'), { recursive: true });
await writeFile(path.join(root, 'index.html'), index);
for (let i = 0; i < projects.length; i++) {
  const project = projects[i];
  const page = `${head(`${project.title} — Jili You`, project.summary, '../')}
<body id="top">
${header('../')}
<main id="main" class="wrap">
  <section class="project-hero" aria-labelledby="project-title">
    <a class="button back-link" href="../index.html">${arrow('←')} Back to home</a>
    <div class="detail-heading">${meta(project)}<h1 id="project-title">${escape(project.title)}</h1><p class="detail-deck">${escape(project.summary)}</p></div>
    ${projectPhotos(project)}
  </section>
  <div class="detail-body">
    <aside class="project-sidebar" aria-label="Project information"><div class="sidebar-block"><h2>Field</h2><p>${escape(project.categoryLabel)}</p></div><div class="sidebar-block"><h2>Topics &amp; tools</h2>${tags(project.tags)}</div></aside>
    <article class="detail-copy" aria-label="About this project"><section><h2>Overview</h2><p>${escape(project.overview)}</p></section>${project.sections.map(section => `<section><h2>${escape(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</section>`).join('')}</article>
  </div>
  <nav class="project-return" aria-label="Return to home"><a class="button" href="../index.html">${arrow('←')} Back to home</a></nav>
</main>
${footer('../')}
<noscript><style>.menu-toggle{display:none}.site-nav{display:flex;position:static;padding:0;border:0;box-shadow:none;flex-direction:row;gap:12px}.header-inner{flex-wrap:wrap;padding-block:12px}.site-nav .nav-contact{border:0;padding:12px 0}</style></noscript>
</body>
</html>
`;
  await writeFile(path.join(root, 'projects', `${project.slug}.html`), page);
}
console.log(`Built index.html and ${projects.length} project pages. No runtime dependencies.`);
