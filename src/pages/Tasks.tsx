import { useState, useEffect } from 'react';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    toast.success('Task created successfully');
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (!editingTask) return;
    setTasks(tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData, completed: task.completed }
        : task
    ));
    toast.success('Task updated successfully');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onTaskComplete={handleTaskComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onTaskCreate={handleCreateTask}
      />

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          initialData={editingTask || undefined}
        />
      )}
    </div>
  );
}