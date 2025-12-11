import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'todoListData';

const ToDoListMaker: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputText('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handleClearCompleted = () => {
      setTasks(tasks.filter(task => !task.completed));
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">My To-Do List</h3>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow w-full px-4 py-2 border rounded-l-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-r-lg transition-colors">Add</button>
        </form>

        <ul className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow space-y-2">
            {tasks.map(task => (
                <li key={task.id} className={`flex items-center p-3 rounded-md transition-colors ${task.completed ? 'bg-gray-100 dark:bg-gray-900/50' : ''}`}>
                    <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="w-5 h-5 rounded text-brand-primary focus:ring-brand-accent" />
                    <span className={`flex-grow mx-4 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{task.text}</span>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"><CloseIcon className="w-5 h-5"/></button>
                </li>
            ))}
            {tasks.length === 0 && <p className="text-center text-gray-400 p-4">Your list is empty. Add a task to get started!</p>}
        </ul>
        
        {tasks.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{remainingCount} items left</span>
                <button onClick={handleClearCompleted} className="font-semibold hover:text-brand-primary dark:hover:text-brand-accent">Clear Completed</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ToDoListMaker;