# 🚀 Launch Posts

## Reddit (r/reactjs & r/webdev)
**Title:** I got tired of third-party proxies breaking my portfolio heatmap, so I built a 100% serverless, zero-runtime-dependency GitHub Calendar for React & Next.js.

**Body:**
If you’ve ever embedded a GitHub contribution heatmap into your portfolio, you've probably used `react-github-calendar` or `ghchart`. They are great tools, but they rely entirely on public proxies. When those proxies hit rate limits or go down, your portfolio crashes or shows a blank gray box.

I wanted 100% uptime, so I rebuilt the entire architecture from the ground up: **[Serverless GitHub Calendar](https://github.com/FaizPalwala/serverless-github-calendar)**.

**How it works:**
1. A highly optimized **GitHub Action** runs natively in your repo twice a day.
2. It hits the GraphQL API and generates a static `contributions.json` straight into your `/public` folder.
3. The React (or Next.js RSC) component reads the local JSON and renders a native, highly-accessible SVG.

**Why this is better:**
* **Zero APIs:** It never hits a third-party server on page load. Zero rate limits.
* **Next.js App Router Native:** Includes a `ServerHeatmap` component that uses `fs.readFileSync` for true Server-Side Rendering. Zero bytes of client-side JS.
* **Private Contributions:** Securely fetches your private commits by running the Action with a repo-scoped PAT. The token never leaves the Action runner, and only raw counts (e.g., `12 commits`) are shipped to the public site.
* **Themes:** It natively uses CSS `color-mix`, meaning you can hook it into Tailwind and Dark Mode with zero effort.

Would love for you guys to tear it apart or try it on your own portfolios. The Action is live on the Marketplace and the component is on NPM today!

GitHub: [https://github.com/FaizPalwala/serverless-github-calendar](https://github.com/FaizPalwala/serverless-github-calendar)

---

## Twitter / X

I got so tired of rate-limited proxy servers breaking my portfolio heatmap that I rebuilt the entire architecture from scratch. 

Introducing: **Serverless GitHub Calendar** ⚡️

A 100% reliable, zero-runtime-dependency GitHub heatmap for React & Next.js. 🧵👇

1/ The problem with standard heatmap libraries is they fetch data from public proxies on page load. When the proxy crashes, your portfolio crashes. 

I solved this by writing a GitHub Action that runs chronologically in your own repo, generating a static JSON file natively.

2/ By serving the data statically from your own domain, you get 100% uptime and 0 runtime API costs.

For Next.js users? I built a native Server Component that parses the JSON via `fs` during SSR. It ships **zero bytes** of JS to the client.

3/ It also solves the "Private Contributions" security risk. 🔒

Since the Action runs server-side, you pass your token to the runner. It aggregates your private commits into raw numbers and ships only the UI. Your token is never exposed to the browser.

4/ Built-in streak stats, dynamic SVG ARIA labels for accessibility, and native CSS variable theming for flawless Dark Mode integration.

It’s open-source, published on NPM, and live on the GitHub Marketplace today. Check it out and drop a ⭐️! 
[Link to Repo]
