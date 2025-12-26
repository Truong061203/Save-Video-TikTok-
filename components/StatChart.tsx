import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { VideoStats } from '../types';

interface StatChartProps {
  stats: VideoStats;
}

const StatChart: React.FC<StatChartProps> = ({ stats }) => {
  const data = [
    { name: 'Likes', value: stats.likes, color: '#f472b6' }, // pink-400
    { name: 'Shares', value: stats.shares, color: '#fbbf24' }, // amber-400
    { name: 'Comments', value: stats.comments, color: '#60a5fa' }, // blue-400
  ];

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value;
  };

  return (
    <div className="w-full h-40 mt-4 bg-slate-900/50 rounded-lg p-2 border border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider px-2">Engagement Metrics</h4>
        <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            </Bar>
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default StatChart;