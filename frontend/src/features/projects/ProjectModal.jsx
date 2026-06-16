import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const ProjectModal = ({ isOpen, onClose, onSuccess, editingProject }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingProject) {
            setName(editingProject.name);
            setDescription(editingProject.description || '');
            setStatus(editingProject.status || 'Active');
        } else {
            setName('');
            setDescription('');
            setStatus('Active');
        }
        setError('');
    }, [editingProject, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const projectData = { name, description, status };
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, projectData);
            } else {
                await api.post('/projects', projectData);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md border border-border dark:border-border-dark overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-border dark:border-border-dark">
                    <h2 className="text-xl font-bold text-text-main dark:text-text-mainDark">
                        {editingProject ? 'Edit Project' : 'New Project'}
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
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Project Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                placeholder="e.g. Website Redesign"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark min-h-[100px]"
                                placeholder="Briefly describe this project..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                            >
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
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
                                {loading ? 'Saving...' : (editingProject ? 'Save Changes' : 'Create Project')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
