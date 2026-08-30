import * as core from '@actions/core';
import * as github from '@actions/github';

const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const username = core.getInput('username', { required: true });
    const outputFile = core.getInput('output-file') || 'public/contributions.json';

    const octokit = github.getOctokit(token);

    core.info(`Fetching contributions for ${username}...`);
    
    const data = await octokit.graphql(query, { username });
    
    const fs = require('fs');
    const path = require('path');
    
    const outputFilePath = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd(), outputFile);
    const outputDir = path.dirname(outputFilePath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    
    core.info(`Successfully wrote contributions to ${outputFilePath}`);
    core.setOutput('output-path', outputFilePath);
    
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
