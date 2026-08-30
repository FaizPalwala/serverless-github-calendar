const { execSync } = require('child_process');

// Validate inputs
const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || 'FaizPalwala';

if (!token) {
  console.error('❌ Error: You must provide a GITHUB_TOKEN environment variable.');
  console.error('Usage: GITHUB_TOKEN=your_pat_here node run-local.js');
  process.exit(1);
}

console.log(`🚀 Running Serverless GitHub Calendar Action locally for ${username}...`);

// Set up the environment variables expected by @actions/core
const env = {
  ...process.env,
  'INPUT_GITHUB-TOKEN': token,
  'INPUT_USERNAME': username,
  'INPUT_OUTPUT-FILE': 'public/contributions.json',
  'INPUT_OUTPUT-SVG': 'public/heatmap.svg',
  'GITHUB_WORKSPACE': process.cwd()
};

try {
  // Execute the compiled Action
  execSync('node packages/serverless-github-calendar-action/dist/index.js', { 
    env, 
    stdio: 'inherit' 
  });
  
  console.log('\n✅ Action completed successfully!');
  console.log('Check the /public directory for your contributions.json and heatmap.svg.');
} catch (error) {
  console.error('\n❌ Action failed to execute.');
  process.exit(1);
}
