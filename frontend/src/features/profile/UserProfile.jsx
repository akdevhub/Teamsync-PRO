import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-text-main dark:text-text-mainDark">Profile</h1>
                <p className="text-text-muted dark:text-text-mutedDark mt-1">Manage your account settings.</p>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border dark:border-border-dark flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-text-mainDark">{user?.name}</h2>
                        <p className="text-text-muted dark:text-text-mutedDark">{user?.email}</p>
                    </div>
                </div>
                
                <div className="p-6 sm:p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-text-main dark:text-text-mainDark mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted dark:text-text-mutedDark mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    disabled 
                                    value={user?.name || ''} 
                                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800 text-text-main dark:text-text-mainDark"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted dark:text-text-mutedDark mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    disabled 
                                    value={user?.email || ''} 
                                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800 text-text-main dark:text-text-mainDark"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border dark:border-border-dark">
                        <button className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors">
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
