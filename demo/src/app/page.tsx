import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ServerHeatmap } from 'serverless-github-calendar/rsc';
import 'serverless-github-calendar/themes/dracula.css';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PROFILES = [
  { id: 'FaizPalwala', name: 'Faiz Palwala', role: 'You' },
  { id: 'leerob', name: 'Lee Robinson', role: 'Vercel' },
  { id: 'torvalds', name: 'Linus Torvalds', role: 'Linux' },
  { id: 'yyx990803', name: 'Evan You', role: 'Vue.js' }
];

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const activeUser = typeof searchParams.user === 'string' ? searchParams.user : 'FaizPalwala';
  
  // Read the mock data to pull out the streak stats for the UI
  const jsonPath = path.join(process.cwd(), 'public', `${activeUser}.json`);
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
    <main className="flex min-h-screen flex-col items-center py-16 px-4 md:px-24 bg-[#0d1117] text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff79c6] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#bd93f9] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff79c6] to-[#bd93f9]">
          Serverless GitHub Calendar
        </h1>
        <p className="mb-12 text-gray-400 text-lg md:text-xl text-center max-w-2xl">
          Zero Runtime JS. 100% Uptime. Rendered securely on the server via <code className="text-[#8be9fd] bg-gray-800/50 px-2 py-1 rounded">fs.readFileSync</code>.
        </p>

        {/* Profile Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PROFILES.map(profile => {
            const isActive = profile.id === activeUser;
            return (
              <Link 
                key={profile.id}
                href={`/?user=${profile.id}`}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all ${
                  isActive 
                    ? 'bg-[#282a36] border-[#bd93f9] shadow-[0_0_15px_rgba(189,147,249,0.3)]' 
                    : 'bg-transparent border-gray-800 hover:border-gray-500 hover:bg-gray-900'
                }`}
              >
                <img src={`https://github.com/${profile.id}.png?size=40`} alt={profile.name} className="w-8 h-8 rounded-full border border-gray-600" />
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>@{profile.id}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{profile.role}</span>
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* The Card */}
        <div className="w-full p-1 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 shadow-2xl backdrop-blur-xl">
          <div className="p-6 md:p-10 rounded-xl bg-[#282a36] w-full flex flex-col items-center relative">
            
            {/* Stats Row */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center p-5 bg-[#1e1f29] rounded-xl border border-gray-700/50 shadow-inner hover:border-gray-500 transition-colors">
                <span className="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-2">Total Contributions</span>
                <span className="text-4xl text-[#f8f8f2] font-black font-mono">{totalContributions.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-[#1e1f29] rounded-xl border border-gray-700/50 shadow-inner hover:border-[#50fa7b]/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#50fa7b] to-[#8be9fd]"></div>
                <span className="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-2">Current Streak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl text-[#50fa7b] font-black font-mono">{currentStreak}</span>
                  <span className="text-lg text-gray-400 font-medium">days</span>
                  {currentStreak > 0 && <span className="text-2xl ml-1">🔥</span>}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-[#1e1f29] rounded-xl border border-gray-700/50 shadow-inner hover:border-[#ffb86c]/50 transition-colors">
                <span className="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-2">Longest Streak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl text-[#ffb86c] font-black font-mono">{longestStreak}</span>
                  <span className="text-lg text-gray-400 font-medium">days</span>
                </div>
              </div>
            </div>

            {/* The Heatmap */}
            <div className="w-full bg-[#1e1f29]/40 rounded-xl p-6 md:p-8 border border-gray-800/50 flex flex-col items-center relative shadow-inner">
              <div className="absolute top-4 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff79c6] animate-pulse"></div>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Static Rendering</span>
              </div>
              <div className="w-full overflow-x-auto pb-4 pt-6 flex justify-center custom-scrollbar">
                <ServerHeatmap jsonUrl={`/${activeUser}.json`} />
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex gap-4">
          <a href="https://github.com/FaizPalwala/serverless-github-calendar" className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
            View on GitHub
          </a>
          <a href="https://www.npmjs.com/package/serverless-github-calendar" className="px-6 py-3 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">
            View on NPM
          </a>
        </div>

      </div>
      
      {/* CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44475a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6272a4; }
      `}} />
    </main>
  );
}
