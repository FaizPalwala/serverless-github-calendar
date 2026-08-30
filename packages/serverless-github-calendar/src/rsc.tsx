import React from 'react';
import fs from 'fs';
import path from 'path';
import { HeatmapProps } from './index';

// A minimal server component that reads the file synchronously from the public folder.
export function ServerHeatmap({
  jsonUrl = 'public/contributions.json',
  blockSize = 10,
  blockMargin = 4,
  className = '',
}: HeatmapProps) {
  try {
    const filePath = path.resolve(process.cwd(), jsonUrl);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    const weeks = data.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    if (weeks.length === 0) return null;

    const width = weeks.length * (blockSize + blockMargin) - blockMargin;
    const height = 7 * (blockSize + blockMargin) - blockMargin;

    const levelMap: Record<string, number> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    return (
      <div className={`serverless-github-heatmap ${className}`}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ '--block-size': `${blockSize}px`, '--block-margin': `${blockMargin}px` } as React.CSSProperties}
          role="img"
          aria-label="GitHub Contributions Heatmap"
        >
          {weeks.map((week: any, weekIndex: number) => (
            <g key={weekIndex} transform={`translate(${weekIndex * (blockSize + blockMargin)}, 0)`}>
              {week.contributionDays.map((day: any) => {
                const level = levelMap[day.contributionLevel] || 0;
                const dateObj = new Date(day.date);
                const dayOfWeek = dateObj.getUTCDay();
                return (
                  <rect
                    key={day.date}
                    y={dayOfWeek * (blockSize + blockMargin)}
                    width={blockSize}
                    height={blockSize}
                    rx={2}
                    ry={2}
                    data-level={level}
                    data-date={day.date}
                    data-count={day.contributionCount}
                    className="heatmap-block"
                    role="img"
                    aria-label={`${day.contributionCount} contributions on ${day.date}`}
                  >
                    <title>{`${day.contributionCount} contributions on ${day.date}`}</title>
                  </rect>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    );
  } catch (error) {
    return <div className={`heatmap-error ${className}`}>Failed to load heatmap from disk.</div>;
  }
}
