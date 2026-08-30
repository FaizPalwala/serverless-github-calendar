<div align="center">
  <br />
  <h1>⚡️ Serverless GitHub Calendar</h1>
  <p>
    <strong>A 100% reliable, zero-runtime-dependency GitHub Contribution Heatmap for React & Static Sites.</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/serverless-github-calendar"><img src="https://img.shields.io/npm/v/serverless-github-calendar?style=flat-square&color=black" alt="NPM Version" /></a>
    <a href="https://github.com/FaizPalwala/serverless-github-calendar/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/serverless-github-calendar?style=flat-square&color=black" alt="License" /></a>
  </p>
</div>

<br />

The popular `react-github-calendar` library relies on proxy APIs that frequently suffer from rate limits and downtime, breaking portfolios everywhere. **Serverless GitHub Calendar** completely reimagines this architecture.

Instead of fetching data on page load, a GitHub Action queries the GraphQL API on a schedule and injects a static JSON file directly into your build. 

### Why is this better?
- 🟢 **100% Uptime**: Your heatmap data is served statically from your own domain. If GitHub's API goes down, your site stays up.
- ⚡️ **Zero Runtime Cost**: No network requests to third-party proxies. Instant rendering.
- 🎨 **Modern Theming**: Built-in support for native CSS variables (`color-mix`) for flawless Tailwind and Dark Mode integration.
- 📦 **Ultra Lightweight**: Zero dependencies.

---

## 🚀 Quickstart

### 1. The GitHub Action

Drop this workflow into your static site repository at `.github/workflows/contributions.yml`. It fetches your data every 12 hours and saves it to your `public` folder.

```yaml
name: Fetch Contributions
on:
  schedule:
    - cron: '0 */12 * * *'
  workflow_dispatch:

jobs:
  update-heatmap:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      
      - uses: FaizPalwala/serverless-github-calendar-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          username: your-github-username
          output-file: public/contributions.json
      
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update github heatmap data"
          file_pattern: public/contributions.json
```

### 2. The React Component

Install the ultra-lightweight component:

```bash
npm install serverless-github-calendar
```

Use it anywhere in your React, Next.js, or Astro application:

```tsx
import { Heatmap } from 'serverless-github-calendar';
import 'serverless-github-calendar/style.css'; // Optional default themes

export default function Portfolio() {
  // Automatically loads '/contributions.json' from your public folder
  return <Heatmap />;
}
```

---

## 🎨 Theming & Customization

The component uses CSS variables for theming, meaning it natively responds to your app's global stylesheets without requiring heavy JavaScript theme providers.

```css
/* Add this to your global CSS */
:root {
  --serverless-github-color-0: #ebedf0;
  --serverless-github-color-1: #9be9a8;
  --serverless-github-color-2: #40c463;
  --serverless-github-color-3: #30a14e;
  --serverless-github-color-4: #216e39;
}

.dark {
  --serverless-github-color-0: #161b22;
  --serverless-github-color-1: #0e4429;
  --serverless-github-color-2: #006d32;
  --serverless-github-color-3: #26a641;
  --serverless-github-color-4: #39d353;
}
```

## 📚 Migration Guide (from `react-github-calendar`)

1. Add the GitHub Action workflow to your repository.
2. Swap the dependency: `npm uninstall react-github-calendar && npm i serverless-github-calendar`.
3. Replace `<GitHubCalendar username="..." />` with `<Heatmap />`.

Done. You now have a faster, un-breakable portfolio.

## License

MIT

---

## 🔥 Growth Hack Features Included!

### 1. The "Profile README" SVG Generator
If you want to show your heatmap on your `username/username` GitHub Profile README (which doesn't support React components), the Action now generates an SVG!
```yaml
      - uses: FaizPalwala/serverless-github-calendar-action@v1
        with:
          username: your-github-username
          output-svg: public/heatmap.svg
```
Now just add `![My Heatmap](heatmap.svg)` to your profile markdown!

### 2. Built-in Streak Stats
The JSON and SVG now automatically calculate and include your **Current Streak** and **Longest Streak**. Flex your commit consistency with zero extra API requests.

### 3. Pre-packaged Community Themes
Don't want to write CSS variables? We got you. Import a beautiful pre-packaged theme:
```tsx
import 'serverless-github-calendar/themes/dracula.css';
// Or: github-dark.css, github-light.css
```

### 4. Next.js React Server Component (RSC) Support
If you're using the Next.js App Router, you can use our Server Component for zero client-side JavaScript.
```tsx
import { ServerHeatmap } from 'serverless-github-calendar/rsc';

export default function Page() {
  // Reads the JSON file instantly on the server using fs.readFileSync
  return <ServerHeatmap />;
}
```
