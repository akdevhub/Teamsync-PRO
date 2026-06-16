import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { LayoutGrid, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsView = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/summary');
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const COLORS = ['#10b981', '#f59e0b', '#3b82f6']; // Green, Yellow, Blue

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-muted dark:text-text-mutedDark font-medium text-sm">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-3xl font-bold text-text-main dark:text-text-mainDark">{value}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-center py-10">Failed to load analytics data.</div>;

    const { metrics, chartData } = data;

    // Custom Tooltip for charts to support dark mode gracefully
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-3 rounded-lg shadow-lg">
                    <p className="font-medium text-text-main dark:text-text-mainDark mb-1">{label || payload[0].name}</p>
                    <p className="text-sm" style={{ color: payload[0].color || payload[0].fill }}>
                        Value: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-main dark:text-text-mainDark">Analytics</h1>
                <p className="text-text-muted dark:text-text-mutedDark mt-1">Real-time insights and metrics for your workspace.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Projects" 
                    value={metrics.totalProjects} 
                    icon={LayoutGrid} 
                    colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                />
                <StatCard 
                    title="Total Tasks" 
                    value={metrics.totalTasks} 
                    icon={CheckSquare} 
                    colorClass="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" 
                />
                <StatCard 
                    title="Pending Tasks" 
                    value={metrics.pendingTasks} 
                    icon={Clock} 
                    colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" 
                />
                <StatCard 
                    title="Completion Rate" 
                    value={`${metrics.completionPercentage}%`} 
                    icon={TrendingUp} 
                    colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                
                {/* Task Distribution Donut Chart */}
                <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-text-main dark:text-text-mainDark mb-6">Task Distribution</h3>
                    <div className="h-64 w-full">
                        {metrics.totalTasks === 0 ? (
                            <div className="flex h-full items-center justify-center text-text-muted dark:text-text-mutedDark">
                                No task data available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.taskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.taskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Volume Comparison Bar Chart */}
                <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-text-main dark:text-text-mainDark mb-6">Workspace Volume</h3>
                    <div className="h-64 w-full">
                        {metrics.totalProjects === 0 && metrics.totalTasks === 0 ? (
                            <div className="flex h-full items-center justify-center text-text-muted dark:text-text-mutedDark">
                                No workspace data available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData.volumeComparison}
                                    margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        allowDecimals={false}
                                    />
                                    <RechartsTooltip cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#6366f1" // primary color
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsView;
