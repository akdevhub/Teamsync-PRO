import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { Plus, MoreVertical, Search, Edit2, Trash2, FolderKanban } from 'lucide-react';
import ProjectModal from './ProjectModal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const fetchProjects = async (search = '') => {
        setLoading(true);
        try {
            const url = search ? `/projects?keyword=${search}` : '/projects';
            const res = await api.get(url);
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProjects(searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

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
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects(searchTerm);
            } catch (error) {
                console.error("Error deleting project", error);
            }
        }
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleModalSuccess = () => {
        fetchProjects(searchTerm);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-mainDark">Projects</h1>
                    <p className="text-text-muted dark:text-text-mutedDark mt-1">Manage your active projects and workspaces.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium w-full sm:w-auto justify-center"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-text-muted dark:text-text-mutedDark" />
                </div>
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-border dark:border-border-dark rounded-lg leading-5 bg-surface dark:bg-surface-dark text-text-main dark:text-text-mainDark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
            </div>

            {loading ? (
                <LoadingState message="Loading projects..." />
            ) : projects.length === 0 ? (
                <EmptyState 
                    icon={FolderKanban}
                    title="No projects found"
                    message={searchTerm ? 'No projects match your search.' : 'No projects found. Create one to get started.'}
                    actionButton={
                        !searchTerm && (
                            <button 
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                <Plus size={18} /> Create Project
                            </button>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-text-main dark:text-text-mainDark group-hover:text-primary transition-colors pr-8">
                                    {project.name}
                                </h3>
                                <div className="absolute top-6 right-4">
                                    <button 
                                        onClick={() => toggleDropdown(project._id)}
                                        className="text-text-muted hover:text-text-main dark:hover:text-text-mainDark focus:outline-none p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    
                                    {activeDropdown === project._id && (
                                        <div 
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-md shadow-lg z-10 border border-border dark:border-border-dark py-1"
                                        >
                                            <button 
                                                onClick={() => openEditModal(project)}
                                                className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-text-mainDark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                                            >
                                                <Edit2 size={16} /> Edit Project
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(project._id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                            >
                                                <Trash2 size={16} /> Delete Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-text-muted dark:text-text-mutedDark mb-6 line-clamp-2">
                                {project.description || "No description provided."}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    project.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                    project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                    {project.status}
                                </span>
                                <span className="text-xs text-text-muted dark:text-text-mutedDark">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProjectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                editingProject={editingProject}
            />
        </div>
    );
};

export default ProjectsList;
