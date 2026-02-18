import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  DndContext, DragOverlay, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import KanbanColumn from './KanbanColumn';
import { useUpdateTask, useReorderTasks } from '../../hooks/useTasks';

export const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#8080aa' },
  { id: 'in_progress', label: 'In Progress',  color: '#6c63ff' },
  { id: 'in_review',   label: 'In Review',    color: '#f7971e' },
  { id: 'done',        label: 'Done',         color: '#43e97b' },
];

export default function KanbanBoard({ projectId, tasks, loading }) {
  const theme = useTheme();
  const [activeTask, setActiveTask] = React.useState(null);
  const [localTasks, setLocalTasks] = React.useState([]);

  const updateTask = useUpdateTask(projectId);
  const reorderTasks = useReorderTasks(projectId);

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getTasksByColumn = (columnId) =>
    localTasks.filter((t) => t.status === columnId).sort((a, b) => a.order - b.order);

  const handleDragStart = ({ active }) => {
    const task = localTasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const activeTask = localTasks.find((t) => t._id === active.id);
    if (!activeTask) return;

    // Dropping on a column header
    const targetColumn = COLUMNS.find((c) => c.id === over.id);
    if (targetColumn) {
      if (activeTask.status !== targetColumn.id) {
        const updated = localTasks.map((t) =>
          t._id === activeTask._id ? { ...t, status: targetColumn.id } : t
        );
        setLocalTasks(updated);
        updateTask.mutate({ taskId: activeTask._id, status: targetColumn.id });
      }
      return;
    }

    // Dropping on another task
    const overTask = localTasks.find((t) => t._id === over.id);
    if (!overTask) return;

    const newStatus = overTask.status;
    const columnTasks = getTasksByColumn(newStatus);

    if (activeTask.status === newStatus) {
      // Reorder within column
      const oldIndex = columnTasks.findIndex((t) => t._id === activeTask._id);
      const newIndex = columnTasks.findIndex((t) => t._id === overTask._id);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);

      const updatedTasks = localTasks.map((t) => {
        const newOrder = reordered.findIndex((r) => r._id === t._id);
        if (newOrder !== -1) return { ...t, order: newOrder };
        return t;
      });
      setLocalTasks(updatedTasks);

      reorderTasks.mutate(
        reordered.map((t, i) => ({ _id: t._id, status: newStatus, order: i }))
      );
    } else {
      // Move to different column
      const updated = localTasks.map((t) =>
        t._id === activeTask._id ? { ...t, status: newStatus } : t
      );
      setLocalTasks(updated);
      updateTask.mutate({ taskId: activeTask._id, status: newStatus });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        display: 'flex', gap: 2, p: 3, height: '100%',
        overflowX: 'auto', overflowY: 'hidden',
        '&::-webkit-scrollbar': { height: 8 },
      }}>
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByColumn(column.id);
          return (
            <SortableContext
              key={column.id}
              items={columnTasks.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={columnTasks}
                projectId={projectId}
                loading={loading}
              />
            </SortableContext>
          );
        })}
      </Box>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} projectId={projectId} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
