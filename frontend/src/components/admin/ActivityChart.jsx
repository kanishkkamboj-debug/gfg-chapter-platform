import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch('/api/analytics/historical', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          // Ensure numbers are properly parsed, as PostgreSQL might return strings for COUNT/COALESCE
          const formattedData = json.map(item => ({
            name: item.name,
            users: parseInt(item.users, 10),
            transmissions: parseInt(item.transmissions, 10)
          }));
          setData(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch historical activity data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricalData();
  }, []);

  return (
    <div className="bg-[#0c1610] border border-[#1a3324] rounded-2xl p-6 h-[400px]">
      <h3 className="text-lg font-bold text-white mb-6">Transmission & Engagement Activity (Last 7 Days)</h3>
      <div className="h-[300px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-[#00FF88] font-mono animate-pulse">Syncing historical data...</div>
        ) : (
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
                allowDecimals={false}
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
        )}
      </div>
    </div>
  );
};

export default ActivityChart;
