
  # Portfolio website design

  This is a code bundle for Portfolio website design. The original project is available at https://www.figma.com/design/B0obHQT5u5zUiM7ZiLRjcr/Portfolio-website-design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Publishing (GitHub Pages)

  This repo deploys with **GitHub Actions**, not by committing build output to `main`.

  1. On GitHub: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
  2. Push to `main`. The workflow **Build** runs `npm ci` and `npm run build`, then uploads the **`dist/`** folder as the site.
  3. After the workflow finishes, wait a minute and open the site with a hard refresh (e.g. Cmd+Shift+R) if you still see an old version.

  Locally you can run `npm run build` and preview `dist/` with any static server (e.g. `npx serve dist`).
