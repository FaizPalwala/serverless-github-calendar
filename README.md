# Serverless GitHub Calendar: Serverless GitHub Contribution Heatmap

**A highly reliable, 100% serverless open-source replacement for `react-github-calendar`.**

Due to the sunset of Deno Deploy Classic, proxy-based APIs like `github-contributions-api.deno.dev` and the libraries that rely on them (such as `react-github-calendar`) have experienced significant downtime, effectively breaking many personal websites and portfolios.

**Serverless GitHub Calendar** is a modern, statically-generated alternative that avoids fragile third-party proxies entirely.

## Why Serverless GitHub Calendar?

1. **Zero Runtime API Dependency**: Instead of fetching data from a proxy on page load, a GitHub Action queries the official GitHub GraphQL API on a schedule and outputs a static JSON file.
2. **100% Uptime**: Your heatmap data is served statically alongside your website assets. Even if the GitHub API goes down, your site will still display your most recently generated heatmap.
3. **Modern CSS Variables**: Native support for `color-mix` and easy Tailwind CSS or dark mode integration.
4. **Lightweight**: Zero-dependency React component that maps JSON to SVG cleanly.

## Migration Guide (from `react-github-calendar`)

Migrating is easy and takes less than 5 minutes.

### 1. Set up the GitHub Action

In your static site repository, add the following workflow file at `.github/workflows/fetch-contributions.yml`:

```yaml
name: Fetch GitHub Contributions

on:
  schedule:
    - cron: '0 */12 * * *' # Run every 12 hours
  workflow_dispatch: # Allow manual triggering

jobs:
  fetch-contributions:
    runs-on: ubuntu-latest
    permissions:
      contents: write # Needed to commit the file back to the repository
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Fetch Contributions
        uses: ./packages/serverless-github-calendar-action # Or specify the published action URL, e.g. serverless-github-calendar/action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          username: your-github-username
          output-file: public/contributions.json
      
      - name: Commit contributions
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update github contributions"
          file_pattern: public/contributions.json
```

*Note: For static site generators like Next.js, Astro, or Hugo, output the file to the `public` or `static` directory.*

### 2. Install the React Component

Remove the old dependency and install the new one:

```bash
npm uninstall react-github-calendar
npm install serverless-github-calendar
```

### 3. Update your React Code

**Before:**
```tsx
import GitHubCalendar from 'react-github-calendar';

function App() {
  return <GitHubCalendar username="your-github-username" />;
}
```

**After:**
```tsx
import { Heatmap } from 'serverless-github-calendar';
// Optional: import default styles
import 'serverless-github-calendar/style.css'; 

function App() {
  // It automatically fetches `/contributions.json` by default
  return <Heatmap jsonUrl="/contributions.json" />;
}
```

## Styling & Theming

Serverless GitHub Calendar uses modern CSS variables for seamless dark mode integration. You can override these variables in your global CSS to match your site's theme.

```css
:root {
  --serverless-github-calendar-color-0: #ebedf0;
  --serverless-github-calendar-color-1: #9be9a8;
  --serverless-github-calendar-color-2: #40c463;
  --serverless-github-calendar-color-3: #30a14e;
  --serverless-github-calendar-color-4: #216e39;
}

[data-theme='dark'] {
  --serverless-github-calendar-color-0: #161b22;
  --serverless-github-calendar-color-1: #0e4429;
  --serverless-github-calendar-color-2: #006d32;
  --serverless-github-calendar-color-3: #26a641;
  --serverless-github-calendar-color-4: #39d353;
}
```

## Packages in this Monorepo

- `serverless-github-calendar-action`: The GitHub Action to fetch and format contribution data.
- `serverless-github-calendar`: The ultra-lightweight React component.

## License

MIT
