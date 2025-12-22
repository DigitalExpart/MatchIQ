import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface CompatibilityRadarProps {
  data: Array<{
    category: string;
    alignment: number;
  }>;
  className?: string;
}

export function CompatibilityRadar({ data, className = '' }: CompatibilityRadarProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Radar
            dataKey="alignment"
            stroke="#a855f7"
            fill="url(#radarGradient)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
