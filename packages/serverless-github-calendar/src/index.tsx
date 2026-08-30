import React, { useEffect, useState } from 'react';

export interface HeatmapProps {
  /** URL to the contributions.json file */
  jsonUrl?: string;
  /** Width of each day block */
  blockSize?: number;
  /** Spacing between blocks */
  blockMargin?: number;
  /** Optional class name for styling */
  className?: string;
}

export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface ContributionDay {
  contributionCount: number;
  date: string;
  contributionLevel: ContributionLevel;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionsData {

  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        totalContributions: number;
        weeks: ContributionWeek[];
      };
    };
  };
}

const levelMap: Record<ContributionLevel, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export function Heatmap({
  jsonUrl = '/contributions.json',
  blockSize = 10,
  blockMargin = 4,
  className = '',
}: HeatmapProps) {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(jsonUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contributions');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, [jsonUrl]);

  if (error) {
    return <div className={`heatmap-error ${className}`}>Error loading heatmap: {error}</div>;
  }

  if (!data) {
    return <div className={`heatmap-loading ${className}`}>Loading heatmap...</div>;
  }

  const weeks = data.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  if (weeks.length === 0) return null;

  const width = weeks.length * (blockSize + blockMargin) - blockMargin;
  const height = 7 * (blockSize + blockMargin) - blockMargin;

  return (
    <div className={`serverless-github-calendar-heatmap ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ '--block-size': `${blockSize}px`, '--block-margin': `${blockMargin}px` } as React.CSSProperties}
        role="img"
        aria-label="GitHub Contributions Heatmap"
      >
        {weeks.map((week, weekIndex) => (
          <g key={weekIndex} transform={`translate(${weekIndex * (blockSize + blockMargin)}, 0)`}>
            {week.contributionDays.map((day) => {
              const level = levelMap[day.contributionLevel] || 0;
              const dateObj = new Date(day.date);
              const dayOfWeek = dateObj.getUTCDay(); // 0 for Sunday
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
}
