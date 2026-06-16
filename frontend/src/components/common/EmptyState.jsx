import React from 'react';

const EmptyState = ({ icon: Icon, title, message, actionButton }) => {
    return (
        <div className="text-center py-20 bg-surface dark:bg-surface-dark border border-dashed border-border dark:border-border-dark rounded-xl w-full">
            {Icon && <Icon className="h-12 w-12 text-text-muted dark:text-text-mutedDark mx-auto mb-4 opacity-50" />}
            <h3 className="text-lg font-medium text-text-main dark:text-text-mainDark">{title}</h3>
            <p className="text-text-muted dark:text-text-mutedDark mt-1 max-w-sm mx-auto mb-6">
                {message}
            </p>
            {actionButton && (
                <div className="flex justify-center">
                    {actionButton}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
