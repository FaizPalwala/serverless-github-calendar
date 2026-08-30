import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';
import path from 'path';

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

const levelMap: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function calculateStreaks(weeks: any[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  
  // Flatten days
  const allDays = weeks.flatMap(w => w.contributionDays);
  
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }
  
  // If the last day has 0 contributions, maybe they haven't committed today yet.
  // We can look at the latest day. If the latest day is 0, we can check yesterday.
  // But for a simple approach, standard logic applies.
  return { currentStreak, longestStreak };
}

function generateSvg(weeks: any[], theme: any, streakData: any) {
  const blockSize = 10;
  const blockMargin = 4;
  const width = weeks.length * (blockSize + blockMargin) - blockMargin;
  const height = 7 * (blockSize + blockMargin) - blockMargin + 20; // +20 for text

  let rects = '';
  weeks.forEach((week: any, weekIndex: number) => {
    const x = weekIndex * (blockSize + blockMargin);
    week.contributionDays.forEach((day: any) => {
      const level = levelMap[day.contributionLevel] || 0;
      const dateObj = new Date(day.date);
      const dayOfWeek = dateObj.getUTCDay(); // 0 for Sunday
      const y = dayOfWeek * (blockSize + blockMargin);
      const color = theme[`color_${level}`] || theme.color_0;
      
      rects += `\n    <rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" rx="2" ry="2" fill="${color}">
      <title>${day.contributionCount} contributions on ${day.date}</title>
    </rect>`;
    });
  });

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 10px; fill: ${theme.text_color}; }
  </style>
  <g>
${rects}
  </g>
  <text x="0" y="${height - 2}">Current Streak: ${streakData.currentStreak} days | Longest Streak: ${streakData.longestStreak} days</text>
</svg>`;
}

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const username = core.getInput('username', { required: true });
    const outputFile = core.getInput('output-file') || 'public/contributions.json';
    const outputSvg = core.getInput('output-svg');
    const color0 = core.getInput('color-0') || '#ebedf0';
    const color1 = core.getInput('color-1') || '#9be9a8';
    const color2 = core.getInput('color-2') || '#40c463';
    const color3 = core.getInput('color-3') || '#30a14e';
    const color4 = core.getInput('color-4') || '#216e39';
    const textColor = core.getInput('text-color') || '#24292e';

    const octokit = github.getOctokit(token);
    core.info(`Fetching contributions for ${username}...`);
    
    const data: any = await octokit.graphql(query, { username });
    const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    const streaks = calculateStreaks(weeks);
    
    // Inject streak data into the JSON
    data.user.contributionsCollection.contributionCalendar.streaks = streaks;

    const outputFilePath = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd(), outputFile);
    const outputDir = path.dirname(outputFilePath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    core.info(`Successfully wrote contributions JSON to ${outputFilePath}`);
    core.setOutput('output-path', outputFilePath);

    // Write SVG if requested
    if (outputSvg) {
      const svgPath = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd(), outputSvg);
      const svgDir = path.dirname(svgPath);
      if (!fs.existsSync(svgDir)) {
        fs.mkdirSync(svgDir, { recursive: true });
      }
      
      const theme = {
        color_0: color0, color_1: color1, color_2: color2, color_3: color3, color_4: color4, text_color: textColor
      };
      
      const svgContent = generateSvg(weeks, theme, streaks);
      fs.writeFileSync(svgPath, svgContent);
      core.info(`Successfully wrote contributions SVG to ${svgPath}`);
    }
    
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
