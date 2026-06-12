import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Generate some realistic mock data for the last 7 days
const generateData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      users: Math.floor(Math.random() * 50) + 20, // 20 to 70 active users
      transmissions: Math.floor(Math.random() * 100) + 40, // 40 to 140 transmissions
    });
  }
  return data;
};

const data = generateData();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1118] border border-[#1a3324] p-4 rounded-xl shadow-2xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name === 'transmissions' ? 'Transmissions' : 'Active Users'}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  return (
    <div className="bg-[#0c1610] border border-[#1a3324] rounded-2xl p-6 h-[400px]">
      <h3 className="text-lg font-bold text-white mb-6">Transmission & Engagement Activity (Last 7 Days)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTransmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3324" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#a3b8cc" 
              tick={{fill: '#a3b8cc', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#a3b8cc" 
              tick={{fill: '#a3b8cc', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1a3324', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="transmissions" 
              stroke="#00FF88" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTransmissions)" 
              activeDot={{ r: 6, fill: '#00FF88', stroke: '#0c1610', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#00D4FF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUsers)" 
              activeDot={{ r: 6, fill: '#00D4FF', stroke: '#0c1610', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
