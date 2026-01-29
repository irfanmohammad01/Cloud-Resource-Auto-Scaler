/**
 * MetricsChart component
 * 
 * Reusable line chart for displaying CPU or Memory metrics over time
 * Uses Recharts library for visualization
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types/metrics.types';

interface MetricsChartProps {
    data: ChartDataPoint[];
    title: string;
    dataKey: string;
    color: string;
}

/**
 * Line chart component for metrics visualization
 * 
 * @param data - Array of chart data points with timestamp and value
 * @param title - Chart title (e.g., "CPU Usage")
 * @param dataKey - Key for the data value (always "value" in our case)
 * @param color - Line color
 */
const MetricsChart: React.FC<MetricsChartProps> = ({ data, title, dataKey, color }) => {
    return (
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>{title}</h3>

            {data.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            label={{ value: 'Percentage (%)', dx: 0, dy: 50, angle: -90, position: 'insideLeft' }}
                            domain={[0, 100]}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            name={title}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default MetricsChart;
