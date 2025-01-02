import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import styles from '../pagesStyles/tasks.module.css'; // Si usas CSS Modules
// Si no usas CSS Modules, ignora esta línea.

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  category_id: number;
  time_spent: number;
  status: string;
  current_start: number;
  category?: Category; // Anidado en la respuesta
}

export default function TasksPage() {
  // Estados para tareas y creación de nueva tarea
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- Fetch Tareas ---
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${baseUrl}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Fetch Categorías ---
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${baseUrl}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id); // Seleccionar la primera categoría por defecto
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Crear Tarea ---
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCategory) return;

    try {
      const res = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category_id: selectedCategory, // Usar la categoría seleccionada
        }),
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Tarea creada');
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // --- Operaciones en Tareas (iniciar, pausar, finalizar, eliminar) ---
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Tarea eliminada');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startTask = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/tasks/${id}/start`, {
        method: 'PATCH',
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Tarea iniciada');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const pauseTask = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/tasks/${id}/pause`, {
        method: 'PATCH',
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Tarea pausada');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const finishTask = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/tasks/${id}/finish`, {
        method: 'PATCH',
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Tarea finalizada');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar tareas y categorías al inicio
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center ${styles.mainContainer}`}>
      <h1 className={styles.title}>Tareas</h1>

      <form onSubmit={createTask} className={styles.formWrapper}>
        <input
          type="text"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.customInput}
        />

        {/* Combobox de categorías */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className={styles.customInput}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear Tarea
        </button>
      </form>

      <div className={styles.gridTasks}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStart={() => startTask(task.id)}
            onPause={() => pauseTask(task.id)}
            onFinish={() => finishTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
