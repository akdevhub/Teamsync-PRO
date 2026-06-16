import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { Plus, CheckCircle2, Circle, Clock, MoreVertical, Edit2, Trash2, Search, Filter, LayoutList, LayoutGrid, CheckSquare } from 'lucide-react';
import TaskModal from './TaskModal';
import KanbanBoard from './board/KanbanBoard';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

const TasksList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
    
    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Modal & Dropdown state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const fetchTasks = async (search = '', status = '') => {
        setLoading(true);
        try {
            let url = '/tasks?';
            if (search) url += `keyword=${search}&`;
            if (status) url += `status=${status}`;
            
            const res = await api.get(url);
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTasks(searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    // Handle outside click for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks(searchTerm, statusFilter);
            } catch (error) {
                console.error("Error deleting task", error);
            }
        }
        setActiveDropdown(null);
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
        await updateTaskStatus(task, newStatus);
    };

    const updateTaskStatus = async (task, newStatus) => {
        // Optimistic UI Update
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));

        try {
            await api.put(`/tasks/${task._id}`, { status: newStatus });
        } catch (error) {
            console.error("Error updating task status", error);
            // Revert on failure
            setTasks(previousTasks);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleModalSuccess = () => {
        fetchTasks(searchTerm, statusFilter);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const StatusIcon = ({ status }) => {
        switch(status) {
            case 'Completed': return <CheckCircle2 className="text-secondary dark:text-secondary-dark" size={20} />;
            case 'In Progress': return <Clock className="text-yellow-500" size={20} />;
            default: return <Circle className="text-text-muted dark:text-text-mutedDark hover:text-secondary transition-colors" size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-mainDark">Tasks</h1>
                    <p className="text-text-muted dark:text-text-mutedDark mt-1">Track and manage your to-do items.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-surface dark:bg-surface-dark shadow-sm text-primary dark:text-primary-dark' : 'text-text-muted dark:text-text-mutedDark hover:text-text-main dark:hover:text-text-mainDark'}`}
                            title="List View"
                        >
                            <LayoutList size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-surface dark:bg-surface-dark shadow-sm text-primary dark:text-primary-dark' : 'text-text-muted dark:text-text-mutedDark hover:text-text-main dark:hover:text-text-mainDark'}`}
                            title="Board View"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium flex-1 sm:flex-none justify-center"
                    >
                        <Plus size={20} />
                        New Task
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted dark:text-text-mutedDark" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-border dark:border-border-dark rounded-lg leading-5 bg-surface dark:bg-surface-dark text-text-main dark:text-text-mainDark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>
                
                <div className="relative min-w-[150px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-border dark:border-border-dark rounded-lg leading-5 bg-surface dark:bg-surface-dark text-text-main dark:text-text-mainDark focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {loading && tasks.length === 0 ? (
                <LoadingState message="Loading tasks..." />
            ) : tasks.length === 0 ? (
                <EmptyState 
                    icon={CheckSquare}
                    title="No tasks found"
                    message={searchTerm || statusFilter ? 'No tasks match your filters.' : 'No tasks available. You\'re all caught up!'}
                    actionButton={
                        !(searchTerm || statusFilter) && (
                            <button 
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                <Plus size={18} /> Create Task
                            </button>
                        )
                    }
                />
            ) : viewMode === 'board' ? (
                <KanbanBoard 
                    tasks={tasks} 
                    onTaskStatusChange={updateTaskStatus}
                    onEditTask={openEditModal}
                />
            ) : (
                <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                    <ul className="divide-y divide-border dark:divide-border-dark">
                        {tasks.map(task => (
                            <li key={task._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4 flex-1">
                                    <button 
                                        onClick={() => toggleStatus(task)}
                                        className="focus:outline-none shrink-0"
                                        title={task.status === 'Completed' ? 'Mark Todo' : 'Mark Completed'}
                                    >
                                        <StatusIcon status={task.status} />
                                    </button>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className={`text-sm font-medium truncate ${task.status === 'Completed' ? 'text-text-muted line-through' : 'text-text-main dark:text-text-mainDark'}`}>
                                            {task.title}
                                        </h4>
                                        {task.project && (
                                            <span className="text-xs text-text-muted dark:text-text-mutedDark mt-1 block truncate">
                                                {task.project.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider hidden sm:inline-block ${
                                        task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                        {task.priority}
                                    </span>

                                    <div className="relative">
                                        <button 
                                            onClick={() => toggleDropdown(task._id)}
                                            className="text-text-muted hover:text-text-main dark:hover:text-text-mainDark focus:outline-none p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        
                                        {activeDropdown === task._id && (
                                            <div 
                                                ref={dropdownRef}
                                                className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-md shadow-lg z-10 border border-border dark:border-border-dark py-1"
                                            >
                                                <button 
                                                    onClick={() => openEditModal(task)}
                                                    className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-text-mainDark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                                                >
                                                    <Edit2 size={16} /> Edit Task
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(task._id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                >
                                                    <Trash2 size={16} /> Delete Task
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <TaskModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                editingTask={editingTask}
            />
        </div>
    );
};

export default TasksList;
