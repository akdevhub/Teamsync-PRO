import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const TaskModal = ({ isOpen, onClose, onSuccess, editingTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Todo');
    const [priority, setPriority] = useState('Medium');
    const [project, setProject] = useState('');
    const [projects, setProjects] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [fetchingProjects, setFetchingProjects] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setStatus(editingTask.status || 'Todo');
            setPriority(editingTask.priority || 'Medium');
            setProject(editingTask.project?._id || editingTask.project || '');
        } else {
            setTitle('');
            setDescription('');
            setStatus('Todo');
            setPriority('Medium');
            setProject('');
        }
        setError('');
    }, [editingTask, isOpen]);

    const fetchProjects = async () => {
        setFetchingProjects(true);
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to load projects for dropdown', err);
        } finally {
            setFetchingProjects(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const taskData = { 
                title, 
                description, 
                status, 
                priority, 
                project: project || null 
            };
            
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md border border-border dark:border-border-dark overflow-hidden flex flex-col my-8">
                <div className="flex justify-between items-center p-6 border-b border-border dark:border-border-dark">
                    <h2 className="text-xl font-bold text-text-main dark:text-text-mainDark">
                        {editingTask ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-text-muted hover:text-text-main dark:text-text-mutedDark dark:hover:text-text-mainDark transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Task Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                placeholder="e.g. Design Homepage UI"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark min-h-[80px]"
                                placeholder="Details about this task..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Project</label>
                            <select
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                disabled={fetchingProjects}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                            >
                                <option value="">No Project (Independent Task)</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3 border-t border-border dark:border-border-dark mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-text-muted hover:text-text-main dark:text-text-mutedDark dark:hover:text-text-mainDark font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : (editingTask ? 'Save Changes' : 'Create Task')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
