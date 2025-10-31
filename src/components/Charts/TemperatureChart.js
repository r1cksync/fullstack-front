import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TemperatureChart.css';

const TemperatureChart = ({ data }) => {
  const { preferences } = useSelector(state => state.preferences);
  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  const chartData = data.slice(0, 16).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    }),
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }));

  return (
    <div className="temperature-chart">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: tempUnit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke="#667eea" 
            fillOpacity={1} 
            fill="url(#colorTemp)"
            name={`Temperature (${tempUnit})`}
          />
          <Area 
            type="monotone" 
            dataKey="feelsLike" 
            stroke="#764ba2" 
            fillOpacity={1} 
            fill="url(#colorFeels)"
            name={`Feels Like (${tempUnit})`}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="humidity-chart" style={{ marginTop: '30px' }}>
        <h3>Humidity Levels</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;
