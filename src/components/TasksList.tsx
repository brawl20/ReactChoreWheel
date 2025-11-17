import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X, Plus, GripVertical } from 'lucide-react';

interface TasksListProps {
  tasks: string[];
  onAddTask: (task: string) => void;
  onRemoveTask: (task: string) => void;
  onReorderTasks: (startIndex: number, endIndex: number) => void;
}

interface DraggableTaskProps {
  task: string;
  index: number;
  onRemove: (task: string) => void;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableTask({ task, index, onRemove, moveTask }: DraggableTaskProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'task',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-gray-400" />
        <span>{task}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(task)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}

export function TasksList({ tasks, onAddTask, onRemoveTask, onReorderTasks }: TasksListProps) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask('');
  };

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    onReorderTasks(dragIndex, hoverIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card>
        <CardHeader>
          <CardTitle>Chores</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Drag to reorder the rotation sequence</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a chore..."
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No chores yet</p>
            ) : (
              tasks.map((task, index) => (
                <DraggableTask
                  key={task}
                  task={task}
                  index={index}
                  onRemove={onRemoveTask}
                  moveTask={moveTask}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  );
}