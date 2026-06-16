import React from 'react';

const LoadingState = ({ message = "Loading data..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary dark:border-primary-dark border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-text-muted dark:text-text-mutedDark font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingState;
