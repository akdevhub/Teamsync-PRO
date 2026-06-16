import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, CheckCircle2, Clock, Circle } from 'lucide-react';

const KanbanTaskCard = ({ task, onClickEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                className="bg-surface dark:bg-surface-dark border-2 border-primary border-dashed rounded-lg h-24 w-full opacity-50"
            />
        );
    }

    const StatusIcon = ({ status }) => {
        switch(status) {
            case 'Completed': return <CheckCircle2 className="text-secondary dark:text-secondary-dark" size={16} />;
            case 'In Progress': return <Clock className="text-yellow-500" size={16} />;
            default: return <Circle className="text-text-muted dark:text-text-mutedDark" size={16} />;
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative flex flex-col gap-3 touch-manipulation"
        >
            <div className="flex justify-between items-start gap-2">
                <h4 className={`text-sm font-medium leading-tight ${task.status === 'Completed' ? 'text-text-muted line-through' : 'text-text-main dark:text-text-mainDark'}`}>
                    {task.title}
                </h4>
                <button 
                    onClick={(e) => { e.stopPropagation(); onClickEdit(task); }}
                    className="text-text-muted hover:text-text-main dark:hover:text-text-mainDark opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking button
                >
                    <MoreVertical size={16} />
                </button>
            </div>
            
            {task.project && (
                <div className="text-xs text-text-muted dark:text-text-mutedDark truncate">
                    {task.project.name}
                </div>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-2">
                <StatusIcon status={task.status} />
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                    {task.priority}
                </span>
            </div>
        </div>
    );
};

export default KanbanTaskCard;
