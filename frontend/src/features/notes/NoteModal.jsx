import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = ['General', 'Meeting', 'Idea', 'Resource'];

const NoteModal = ({ isOpen, onClose, onSuccess, editingNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content || '');
            setCategory(editingNote.category || 'General');
        } else {
            setTitle('');
            setContent('');
            setCategory('General');
        }
        setError('');
    }, [editingNote, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const noteData = { title, content, category };
            if (editingNote) {
                await api.put(`/notes/${editingNote._id}`, noteData);
            } else {
                await api.post('/notes', noteData);
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
            <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-2xl border border-border dark:border-border-dark overflow-hidden flex flex-col my-8">
                <div className="flex justify-between items-center p-6 border-b border-border dark:border-border-dark">
                    <h2 className="text-xl font-bold text-text-main dark:text-text-mainDark">
                        {editingNote ? 'Edit Note' : 'New Note'}
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
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                    placeholder="Note title..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-mainDark mb-1">Content</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-main dark:text-text-mainDark min-h-[250px] resize-y font-mono text-sm leading-relaxed"
                                placeholder="Start typing your note here..."
                            />
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
                                {loading ? 'Saving...' : (editingNote ? 'Save Changes' : 'Create Note')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
