import React, { useState, useMemo } from 'react';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanBoard = ({ tasks, onTaskStatusChange, onEditTask }) => {
    const [activeTask, setActiveTask] = useState(null);

    // Group tasks by status
    const columns = useMemo(() => {
        const cols = {
            'Todo': [],
            'In Progress': [],
            'Completed': []
        };
        tasks.forEach(task => {
            if (cols[task.status]) {
                cols[task.status].push(task);
            }
        });
        return cols;
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require 5px movement before dragging starts (helps with clicking)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        if (active.data.current?.type === 'Task') {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEnd = (event) => {
        setActiveTask(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || !activeData.task) return;

        const currentStatus = activeData.task.status;
        let targetStatus = currentStatus;

        // If dropped over a column area
        if (overData?.type === 'Column') {
            targetStatus = overData.status;
        } 
        // If dropped over another task
        else if (overData?.type === 'Task') {
            targetStatus = overData.task.status;
        }

        if (currentStatus !== targetStatus) {
            onTaskStatusChange(activeData.task, targetStatus);
        }
    };

    return (
        <div className="h-[calc(100vh-280px)] min-h-[500px] flex overflow-x-auto pb-4 gap-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {Object.keys(columns).map(status => (
                    <KanbanColumn 
                        key={status} 
                        status={status} 
                        tasks={columns[status]} 
                        onEditTask={onEditTask}
                    />
                ))}

                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-90 transform scale-105 shadow-xl">
                            <KanbanTaskCard task={activeTask} onClickEdit={() => {}} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
