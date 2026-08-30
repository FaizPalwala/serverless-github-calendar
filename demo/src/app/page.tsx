import { ServerHeatmap } from 'serverless-github-calendar/rsc';
import 'serverless-github-calendar/themes/dracula.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#282a36] text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Serverless GitHub Calendar</h1>
      <p className="mb-12 text-gray-400">Zero Runtime JS. Rendered securely on the server.</p>
      
      <div className="p-8 border border-gray-700 rounded-xl bg-[#1e1f29] shadow-2xl">
        <ServerHeatmap />
      </div>
    </main>
  );
}
