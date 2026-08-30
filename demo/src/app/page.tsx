import fs from 'fs';
import path from 'path';
import { ServerHeatmap } from 'serverless-github-calendar/rsc';
import 'serverless-github-calendar/themes/dracula.css';

export default function Home() {
  // Read the mock data to pull out the streak stats for the UI
  const jsonPath = path.join(process.cwd(), 'public', 'contributions.json');
  let totalContributions = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8'); /*turbopackIgnore: true*/
    const parsed = JSON.parse(rawData);
    const calendar = parsed.user?.contributionsCollection?.contributionCalendar;
    if (calendar) {
      totalContributions = calendar.totalContributions || 0;
      currentStreak = calendar.streaks?.currentStreak || 0;
      longestStreak = calendar.streaks?.longestStreak || 0;
    }
  } catch (e) {
    console.error("Could not read stats for demo header", e);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-[#0d1117] text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff79c6] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#bd93f9] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff79c6] to-[#bd93f9]">
          Serverless GitHub Calendar
        </h1>
        <p className="mb-12 text-gray-400 text-lg md:text-xl text-center max-w-2xl">
          Zero Runtime JS. 100% Uptime. Rendered securely on the server via <code className="text-[#8be9fd] bg-gray-800/50 px-2 py-1 rounded">fs.readFileSync</code>.
        </p>
        
        {/* The Card */}
        <div className="w-full p-1 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 shadow-2xl backdrop-blur-xl">
          <div className="p-6 md:p-10 rounded-xl bg-[#282a36] w-full flex flex-col items-center">
            
            {/* Stats Row */}
            <div className="w-full flex flex-wrap justify-between items-center mb-8 gap-4 px-4 text-sm font-mono text-gray-300">
              <div className="flex flex-col items-start">
                <span className="text-gray-500 uppercase text-xs">Total Contributions</span>
                <span className="text-2xl text-[#f8f8f2] font-bold">{totalContributions}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 uppercase text-xs">Current Streak</span>
                <span className="text-2xl text-[#50fa7b] font-bold">{currentStreak} days 🔥</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500 uppercase text-xs">Longest Streak</span>
                <span className="text-2xl text-[#ffb86c] font-bold">{longestStreak} days</span>
              </div>
            </div>

            {/* The Heatmap */}
            <div className="w-full overflow-x-auto pb-4 flex justify-center custom-scrollbar">
              <ServerHeatmap />
            </div>
            
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 flex gap-4">
          <a href="https://github.com/FaizPalwala/serverless-github-calendar" className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            View on GitHub
          </a>
          <a href="https://www.npmjs.com/package/serverless-github-calendar" className="px-6 py-3 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">
            View on NPM
          </a>
        </div>

      </div>
      
      {/* CSS for custom scrollbar so the heatmap scrolls elegantly on mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44475a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6272a4; }
      `}} />
    </main>
  );
}
