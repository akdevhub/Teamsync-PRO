import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, BarChart2, User, LogOut, FileText } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Notes', path: '/notes', icon: FileText },
        { name: 'Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* Mobile overlay */}
            <div 
                className={clsx(
                    'fixed inset-0 z-40 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity lg:hidden',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div className={twMerge(
                'fixed top-0 left-0 z-50 h-screen w-64 bg-[#F7F7F5] dark:bg-[#202020] border-r border-border dark:border-border-dark flex flex-col transition-transform duration-300 ease-in-out',
                !isOpen && '-translate-x-full lg:translate-x-0'
            )}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-border dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary dark:bg-white rounded-md flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-xl">T</span>
                        </div>
                        <span className="font-bold text-lg text-text-main dark:text-text-mainDark tracking-tight">TeamSync Pro</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
                                className={({ isActive }) => clsx(
                                    'flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm',
                                    isActive 
                                        ? 'bg-[#E9E9E7] dark:bg-[#2F2F2F] text-text-main dark:text-white font-semibold' 
                                        : 'text-text-muted dark:text-text-mutedDark hover:bg-[#E9E9E7] dark:hover:bg-[#2F2F2F] hover:text-text-main dark:hover:text-white font-medium'
                                )}
                            >
                                <Icon size={20} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-text-muted dark:text-text-mutedDark hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
