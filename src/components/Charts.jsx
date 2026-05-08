import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export const SpeedChart = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10}} 
            stroke="#888888" 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{fontSize: 10}} 
            stroke="#888888" 
            axisLine={false} 
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const NewsDistributionChart = ({ news }) => {
  const sources = news.reduce((acc, curr) => {
    const name = curr.source.name;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(sources).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
