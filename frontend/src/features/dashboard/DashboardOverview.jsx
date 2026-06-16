import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DailyQuoteWidget from './DailyQuoteWidget';
import {
    Activity,
    CheckSquare,
    FolderKanban,
    Calendar,
    Plus,
    CheckCircle2,
    Circle,
    PlayCircle,
    ArrowRight,
    Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';



const StatCard = ({ title, value, icon: Icon, isLoading, colorClass }) => (
    <div className="bg-surface dark:bg-surface-dark p-4 rounded-xl border border-border dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between">
        <div>
            <p className="text-xs font-semibold text-text-muted dark:text-text-mutedDark uppercase tracking-wider">{title}</p>
            {isLoading ? (
                <div className="h-6 w-12 bg-slate-100 dark:bg-[#30363D] rounded mt-1.5 animate-pulse" />
            ) : (
                <h3 className="text-2xl font-bold text-text-main dark:text-text-mainDark mt-1 group-hover:text-primary transition-colors">{value}</h3>
            )}
        </div>
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
            <Icon size={20} />
        </div>
    </div>
);

const PriorityBadge = ({ priority }) => {
    const styles = {
        High: "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning",
        Medium: "bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark",
        Low: "bg-success/10 text-success dark:bg-success/20 dark:text-success"
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${styles[priority] || styles.Low}`}>
            {priority}
        </span>
    );
};

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    
    const chartColors = isDarkMode ? ['#FFFFFF', '#9B9B9B', '#2F2F2F'] : ['#000000', '#9B9A97', '#E9E9E7'];
    const [summary, setSummary] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, tasksRes, projectsRes] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/tasks'),
                    api.get('/projects')
                ]);

                setSummary(summaryRes.data);
                const tasks = tasksRes.data;
                const projs = projectsRes.data;
                setAllTasks(tasks);

                // Upcoming Deadlines (Due Soon)
                const upcoming = tasks
                    .filter(t => t.status !== 'Completed' && t.dueDate)
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 4);
                setUpcomingTasks(upcoming);

                // Recent Activity Timeline
                const tActivity = tasks.map(t => ({ ...t, type: 'Task' }));
                const pActivity = projs.map(p => ({ ...p, type: 'Project' }));
                const combined = [...tActivity, ...pActivity]
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 5);
                setRecentActivity(combined);

                setProjects(projs.slice(0, 4));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
    });

    const getProjectProgress = (projectId) => {
        const pTasks = allTasks.filter(t => t.project === projectId || t.project?._id === projectId);
        if (pTasks.length === 0) return 0;
        const completed = pTasks.filter(t => t.status === 'Completed').length;
        return Math.round((completed / pTasks.length) * 100);
    };

    return (
        <div className="space-y-5 font-inter max-w-7xl mx-auto pb-6">
            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="flex items-baseline gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-text-main dark:text-text-mainDark tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}
                        </h1>
                        <p className="text-sm font-medium text-text-muted dark:text-text-mutedDark">{currentDate}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Link to="/tasks" className="flex items-center gap-1.5 bg-primary dark:bg-primary-dark hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black px-3 py-1.5 rounded-md text-xs font-semibold transition-all">
                            <Plus size={14} /> New Task
                        </Link>
                        <Link to="/projects" className="flex items-center gap-1.5 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-[#30363D] text-text-main dark:text-text-mainDark px-3 py-1.5 rounded-md text-xs font-semibold transition-all">
                            <FolderKanban size={14} /> New Project
                        </Link>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <DailyQuoteWidget />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Projects" 
                    value={summary?.metrics?.totalProjects || 0} 
                    icon={FolderKanban} 
                    isLoading={loading} 
                    colorClass="bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark"
                />
                <StatCard 
                    title="Active Tasks" 
                    value={summary?.metrics?.pendingTasks || 0} 
                    icon={Activity} 
                    isLoading={loading} 
                    colorClass="bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent"
                />
                <StatCard 
                    title="Completed Tasks" 
                    value={summary?.metrics?.completedTasks || 0} 
                    icon={CheckSquare} 
                    isLoading={loading} 
                    colorClass="bg-success/10 text-success dark:bg-success/20 dark:text-success"
                />
                <StatCard 
                    title="Due Soon" 
                    value={upcomingTasks.length} 
                    icon={Calendar} 
                    isLoading={loading} 
                    colorClass="bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Activity Feed (Timeline Style) */}
                <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-text-main dark:text-text-mainDark mb-4 border-b border-border dark:border-border-dark pb-2">Recent Activity</h3>
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-[#30363D] rounded-md" />)}
                        </div>
                    ) : recentActivity.length > 0 ? (
                        <div className="flex-1 relative mt-2">
                            <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-slate-100 dark:bg-border-dark" />
                            <div className="space-y-4">
                                {recentActivity.map((item, index) => (
                                    <div key={item._id} className="relative flex items-start gap-3">
                                        <div className={`relative z-10 p-1 rounded-full bg-surface dark:bg-surface-dark shadow-sm border ${item.type === 'Task' ? 'border-success text-success dark:border-success-dark dark:text-success-dark' : 'border-primary text-primary dark:border-primary-dark dark:text-primary-dark'}`}>
                                            {item.type === 'Task' ? <CheckSquare size={12} /> : <FolderKanban size={12} />}
                                        </div>
                                        <div className="pt-0">
                                            <p className="text-xs font-semibold text-text-main dark:text-text-mainDark">{item.title || item.name}</p>
                                            <p className="text-[11px] text-text-muted dark:text-text-mutedDark mt-0.5">
                                                {item.type} {item.status === 'Completed' ? 'completed' : 'updated'} on {new Date(item.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-text-muted dark:text-text-mutedDark text-xs py-6">
                            No recent activity to show.
                        </div>
                    )}
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-border dark:border-border-dark pb-2">
                        <h3 className="text-sm font-bold text-text-main dark:text-text-mainDark">Upcoming Deadlines</h3>
                        <Link to="/tasks" className="text-xs font-semibold text-primary dark:text-primary-dark hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    {loading ? (
                         <div className="space-y-3 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-[#30363D] rounded-md" />)}
                        </div>
                    ) : upcomingTasks.length > 0 ? (
                        <div className="space-y-2 flex-1 mt-1">
                            {upcomingTasks.map(task => (
                                <div key={task._id} className="group flex items-center justify-between p-2.5 rounded-md border border-transparent hover:border-border dark:hover:border-border-dark hover:bg-slate-50 dark:hover:bg-[#21262D] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="text-text-muted dark:text-text-mutedDark group-hover:text-primary transition-colors">
                                            {task.status === 'In Progress' ? <PlayCircle size={14} /> : <Circle size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-text-main dark:text-text-mainDark">{task.title}</p>
                                            <p className="text-[10px] font-medium text-text-muted dark:text-text-mutedDark mt-0.5 flex items-center gap-1">
                                                <Clock size={10} /> Due {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-muted dark:text-text-mutedDark text-xs py-6">
                            <div className="text-success mb-2">
                                <CheckCircle2 size={24} />
                            </div>
                            You're all caught up! No upcoming deadlines.
                        </div>
                    )}
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Project Progress */}
                <div className="lg:col-span-2 bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-border dark:border-border-dark pb-2">
                        <h3 className="text-sm font-bold text-text-main dark:text-text-mainDark">Project Progress</h3>
                        <Link to="/projects" className="text-xs font-semibold text-primary dark:text-primary-dark hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-[#30363D] rounded-md" />)}
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="space-y-3 mt-1">
                            {projects.map(project => {
                                const total = project.tasks?.length || 0;
                                const completed = project.tasks?.filter(t => t.status === 'Completed').length || 0;
                                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
                                
                                return (
                                <div key={project._id} className="group flex flex-col p-3 rounded-md border border-transparent hover:border-border dark:hover:border-border-dark hover:bg-slate-50 dark:hover:bg-[#21262D] transition-all">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <FolderKanban size={14} className="text-primary dark:text-primary-dark" />
                                            <Link to={`/projects/${project._id}`} className="text-xs font-bold text-text-main dark:text-text-mainDark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                                                {project.name}
                                            </Link>
                                        </div>
                                        <span className="text-[11px] font-medium text-text-muted dark:text-text-mutedDark">
                                            {completed}/{total} tasks ({progress}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-[#30363D] rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-primary dark:bg-primary-dark h-1.5 rounded-full transition-all duration-700 ease-out" 
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-text-muted dark:text-text-mutedDark text-xs py-6">
                            No projects found. Create one to track progress.
                        </div>
                    )}
                </div>

                {/* Task Distribution Pie Chart */}
                <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-text-main dark:text-text-mainDark mb-4 border-b border-border dark:border-border-dark pb-2">Task Distribution</h3>
                    <div className="flex-1 min-h-[160px] h-[160px]">
                        {loading ? (
                            <div className="h-full w-full bg-slate-100 dark:bg-[#30363D] rounded-full animate-pulse scale-75" />
                        ) : summary?.chartData?.taskDistribution?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={summary.chartData.taskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {summary.chartData.taskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ 
                                            borderRadius: '8px', 
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px'
                                        }} 
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconSize={8} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-text-muted dark:text-text-mutedDark text-xs">
                                No tasks available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
