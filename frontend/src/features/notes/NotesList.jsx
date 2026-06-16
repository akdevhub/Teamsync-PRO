import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { Plus, MoreVertical, Search, Filter, Edit2, Trash2, FileText, Calendar, Lightbulb, Link as LinkIcon } from 'lucide-react';
import NoteModal from './NoteModal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = ['General', 'Meeting', 'Idea', 'Resource'];

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    
    // Modal & Dropdown state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const fetchNotes = async (search = '', category = '') => {
        setLoading(true);
        try {
            let url = '/notes?';
            if (search) url += `keyword=${search}&`;
            if (category) url += `category=${category}`;
            
            const res = await api.get(url);
            setNotes(res.data);
        } catch (error) {
            console.error("Error fetching notes", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNotes(searchTerm, categoryFilter);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, categoryFilter]);

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
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                fetchNotes(searchTerm, categoryFilter);
            } catch (error) {
                console.error("Error deleting note", error);
            }
        }
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleModalSuccess = () => {
        fetchNotes(searchTerm, categoryFilter);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const CategoryBadge = ({ category }) => {
        let colors = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        let Icon = FileText;
        
        switch(category) {
            case 'Meeting': 
                colors = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                Icon = Calendar;
                break;
            case 'Idea':
                colors = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
                Icon = Lightbulb;
                break;
            case 'Resource':
                colors = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary';
                Icon = LinkIcon;
                break;
            case 'General':
            default:
                colors = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
                Icon = FileText;
                break;
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${colors}`}>
                <Icon size={12} /> {category}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-mainDark">Notes & Resources</h1>
                    <p className="text-text-muted dark:text-text-mutedDark mt-1">Capture ideas, meeting minutes, and essential links.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium w-full sm:w-auto justify-center"
                >
                    <Plus size={20} />
                    New Note
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted dark:text-text-mutedDark" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search notes by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-border dark:border-border-dark rounded-lg leading-5 bg-surface dark:bg-surface-dark text-text-main dark:text-text-mainDark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>
                
                <div className="relative min-w-[180px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-border dark:border-border-dark rounded-lg leading-5 bg-surface dark:bg-surface-dark text-text-main dark:text-text-mainDark focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notes Grid */}
            {loading && notes.length === 0 ? (
                <LoadingState message="Loading notes..." />
            ) : notes.length === 0 ? (
                <EmptyState 
                    icon={FileText}
                    title="No notes found"
                    message={searchTerm || categoryFilter ? 'Try adjusting your search or filters.' : 'Get started by creating your first note or resource link.'}
                    actionButton={
                        !(searchTerm || categoryFilter) && (
                            <button 
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                <Plus size={18} /> Create Note
                            </button>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    {notes.map(note => (
                        <div key={note._id} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col h-[220px]">
                            <div className="flex justify-between items-start mb-2">
                                <CategoryBadge category={note.category} />
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => toggleDropdown(note._id)}
                                        className="text-text-muted hover:text-text-main dark:hover:text-text-mainDark focus:outline-none p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    
                                    {activeDropdown === note._id && (
                                        <div 
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-md shadow-lg z-10 border border-border dark:border-border-dark py-1"
                                        >
                                            <button 
                                                onClick={() => openEditModal(note)}
                                                className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-text-mainDark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                                            >
                                                <Edit2 size={16} /> Edit Note
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(note._id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                            >
                                                <Trash2 size={16} /> Delete Note
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-text-main dark:text-text-mainDark mb-2 line-clamp-2 leading-tight">
                                {note.title}
                            </h3>
                            
                            <p className="text-sm text-text-muted dark:text-text-mutedDark flex-1 overflow-hidden font-mono whitespace-pre-wrap mask-image-bottom">
                                {note.content}
                            </p>
                            
                            <div className="pt-3 mt-3 border-t border-border dark:border-border-dark flex items-center justify-between shrink-0">
                                <span className="text-[10px] text-text-muted dark:text-text-mutedDark uppercase tracking-wider font-semibold">
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NoteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                editingNote={editingNote}
            />
        </div>
    );
};

export default NotesList;
