/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 18:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const github = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/github'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const fs_1 = __importDefault(__nccwpck_require__(896));
const path_1 = __importDefault(__nccwpck_require__(928));
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
const levelMap = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
};
function calculateStreaks(weeks) {
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
        }
        else {
            currentStreak = 0;
        }
    }
    // If the last day has 0 contributions, maybe they haven't committed today yet.
    // We can look at the latest day. If the latest day is 0, we can check yesterday.
    // But for a simple approach, standard logic applies.
    return { currentStreak, longestStreak };
}
function secureResolve(basePath, targetPath) {
    const resolved = path_1.default.resolve(basePath, targetPath);
    if (!resolved.startsWith(basePath)) {
        throw new Error(`Security Violation: Path traversal detected. '${targetPath}' is outside the workspace.`);
    }
    return resolved;
}
function generateSvg(weeks, theme, streakData) {
    const blockSize = 10;
    const blockMargin = 4;
    const width = weeks.length * (blockSize + blockMargin) - blockMargin;
    const height = 7 * (blockSize + blockMargin) - blockMargin + 20; // +20 for text
    let rects = '';
    weeks.forEach((week, weekIndex) => {
        const x = weekIndex * (blockSize + blockMargin);
        week.contributionDays.forEach((day) => {
            const level = levelMap[day.contributionLevel] || 0;
            const dateObj = new Date(day.date);
            const dayOfWeek = dateObj.getUTCDay(); // 0 for Sunday
            const y = dayOfWeek * (blockSize + blockMargin);
            const color = theme[`color_${level}`] || theme.color_0;
            rects += `\n    <rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" rx="2" ry="2" fill="${color}" role="img" aria-label="${day.contributionCount} contributions on ${day.date}">
      <title>${day.contributionCount} contributions on ${day.date}</title>
    </rect>`;
        });
    });
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub Contributions Heatmap">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 10px; fill: ${theme.text_color}; }
  </style>
  <g>
${rects}
  </g>
  <text x="0" y="${height - 2}" aria-hidden="true">Current Streak: ${streakData.currentStreak} days | Longest Streak: ${streakData.longestStreak} days</text>
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
        const data = await octokit.graphql(query, { username });
        const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
        const streaks = calculateStreaks(weeks);
        // Inject streak data into the JSON
        data.user.contributionsCollection.contributionCalendar.streaks = streaks;
        const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
        const outputFilePath = secureResolve(workspace, outputFile);
        const outputDir = path_1.default.dirname(outputFilePath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        fs_1.default.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
        core.info(`Successfully wrote contributions JSON to ${outputFilePath}`);
        core.setOutput('output-path', outputFilePath);
        // Write SVG if requested
        if (outputSvg) {
            const svgPath = secureResolve(workspace, outputSvg);
            const svgDir = path_1.default.dirname(svgPath);
            if (!fs_1.default.existsSync(svgDir)) {
                fs_1.default.mkdirSync(svgDir, { recursive: true });
            }
            const theme = {
                color_0: color0, color_1: color1, color_2: color2, color_3: color3, color_4: color4, text_color: textColor
            };
            const svgContent = generateSvg(weeks, theme, streaks);
            fs_1.default.writeFileSync(svgPath, svgContent);
            core.info(`Successfully wrote contributions SVG to ${svgPath}`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/asset-relocator-loader */
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(18);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;