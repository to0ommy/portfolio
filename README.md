# Jili You — Portfolio

A static, English-language portfolio built with HTML, CSS, and JavaScript. The checked-in HTML files are ready to serve, including seven standalone project pages. No framework, package installation, or build service is required to publish the site.

## Preview

Open `index.html` directly, or serve this directory locally:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173`.

## Edit content

- `data/projects.json`: project titles, summaries, tags, images, and detail sections.
- `tools/build.mjs`: home page copy and shared HTML templates.
- `css/style.css`: layout, colours, typography, and responsive styles.
- `js/script.js`: mobile navigation, project filters, and email copying.
- `images/jili-you.jpg`: supplied portrait, displayed with a CSS crop. The original image is unaltered.
- `resume.pdf`: latest resume, linked before Work in the shared navigation.

After changing project content or templates, regenerate the static pages:

```powershell
node tools/build.mjs
```

Node.js is only used for this optional authoring step. Commit the regenerated `index.html` and `projects/*.html` with your source changes.

## GitHub Pages

The live site is https://to0ommy.github.io/portfolio/, published from the `main` branch of `to0ommy/portfolio`. Publish `index.html`, `resume.pdf`, `.nojekyll`, and the complete `css/`, `js/`, `images/`, and `projects/` folders together in one commit. Include `data/` and `tools/` to keep the authoring source in sync. Uploading only the root files leaves the new HTML paired with old styles and scripts and omits the new project pages. All site links are relative, so both repository sites and custom domains are supported.

If configuring Pages for the first time, open the repository's **Settings → Pages**, choose **Deploy from a branch**, and select the branch and folder containing `index.html`. The `.nojekyll` file keeps this a plain static site.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

The original code is retained locally in `.local-backup/original-2026-09-21/`; that directory and `.preview/` are ignored by Git and should not be uploaded.

## Content

The existing introduction is retained, including “third-year,” at the owner's request. Project descriptions are based on the previous website, with no invented dates, metrics, credentials, or repository links. See `CONTENT_REVIEW.md` for details that can be expanded later.
