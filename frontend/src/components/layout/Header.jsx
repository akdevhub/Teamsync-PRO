import React, { useContext } from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    return (
        <header className="h-16 bg-surface/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-border dark:border-border-dark sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-text-muted dark:text-text-mutedDark hover:bg-slate-100 dark:hover:bg-[#1E293B] lg:hidden focus:outline-none transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full text-text-muted dark:text-text-mutedDark hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary dark:bg-primary-dark rounded-full border-2 border-surface dark:border-[#111827]"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border dark:border-border-dark cursor-pointer group">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-text-main dark:text-text-mainDark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs font-medium text-text-muted dark:text-text-mutedDark">
                            {user?.role || 'Member'}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center text-primary dark:text-primary-dark font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-sm font-semibold text-text-main dark:text-text-mainDark">
                        {user?.name}
                    </div>
                </div>
                
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-text-muted dark:text-text-mutedDark hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
