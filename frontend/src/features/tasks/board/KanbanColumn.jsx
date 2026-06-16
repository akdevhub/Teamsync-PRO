import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanColumn = ({ status, tasks, onEditTask }) => {
    const { setNodeRef } = useDroppable({
        id: status,
        data: {
            type: 'Column',
            status,
        }
    });

    const getColumnColor = () => {
        switch(status) {
            case 'Todo': return 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20';
            case 'In Progress': return 'border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-900/10';
            case 'Completed': return 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10';
            default: return 'border-border dark:border-border-dark bg-background dark:bg-background-dark';
        }
    };

    return (
        <div className={`flex flex-col rounded-xl border ${getColumnColor()} min-w-[280px] w-[320px] shrink-0 h-full max-h-full overflow-hidden`}>
            {/* Column Header */}
            <div className="p-4 border-b border-inherit flex items-center justify-between bg-surface dark:bg-surface-dark rounded-t-xl shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-main dark:text-text-mainDark">{status}</h3>
                    <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-text-mutedDark px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Droppable Area */}
            <div 
                ref={setNodeRef}
                className="p-3 flex-1 overflow-y-auto min-h-[150px] flex flex-col gap-3"
            >
                <SortableContext 
                    items={tasks.map(t => t._id)} 
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map(task => (
                        <KanbanTaskCard 
                            key={task._id} 
                            task={task} 
                            onClickEdit={onEditTask} 
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default KanbanColumn;
