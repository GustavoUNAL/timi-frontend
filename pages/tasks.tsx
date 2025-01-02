import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import styles from '../pagesStyles/tasks.module.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';


interface Category {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    title: string;
    category_id: number;
    time_spent: number;
    status: string;
    current_start: number | null;
    created_at?: string;
    finished_at?: string; // <- Añadimos "finished_at" aquí como opcional
    category?: Category;
}

interface ChartData {
    date: string;
    [category: string]: number | string;
}



export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [timers, setTimers] = useState<Record<number, number>>({});
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${baseUrl}/tasks`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${baseUrl}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0].id);
                } else {
                    setSelectedCategory(null);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || selectedCategory === null) return;

        try {
            const res = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category_id: selectedCategory }),
            });
            const data = await res.json();
            alert(data.message || 'Tarea creada');
            setTitle('');
            fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const res = await fetch(`${baseUrl}/tasks/${id}`, { method: 'DELETE' });
            const data = await res.json();
            alert(data.message || 'Tarea eliminada');
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const startTask = async (id: number) => {
        try {
            const res = await fetch(`${baseUrl}/tasks/${id}/start`, { method: 'PATCH' });
            const data = await res.json();
            setTimers((prevTimers) => ({ ...prevTimers, [id]: Date.now() }));
            alert(data.message || 'Tarea iniciada');
            fetchTasks();
        } catch (error) {
            console.error("Error starting task:", error);
        }
    };

    const pauseTask = async (id: number) => {
        try {
            const res = await fetch(`${baseUrl}/tasks/${id}/pause`, { method: 'PATCH' });
            const data = await res.json();
            setTimers((prevTimers) => {
                const newTimers = { ...prevTimers };
                delete newTimers[id];
                return newTimers;
            });
            alert(data.message || 'Tarea pausada');
            fetchTasks();
        } catch (error) {
            console.error("Error pausing task:", error);
        }
    };
    // Función utilitaria para formatear la fecha
    const formatCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const finishTask = async (id: number) => {
        try {
            const res = await fetch(`${baseUrl}/tasks/${id}/finish`, { method: 'PATCH' });
            const data = await res.json();
            setTimers((prevTimers) => {
                const newTimers = { ...prevTimers };
                delete newTimers[id];
                return newTimers;
            });
            alert(data.message || 'Tarea finalizada');
            fetchTasks();
        } catch (error) {
            console.error("Error finishing task:", error);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (Object.keys(timers).length > 0) {
            interval = setInterval(() => {
                setTasks((prevTasks) =>
                    prevTasks.map((task) => {
                        if (task.current_start && timers[task.id]) {
                            return { ...task, time_spent: task.time_spent + 1 };
                        }
                        return task;
                    })
                );
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timers]);



    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, []);


    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600); // 3600 segundos = 1 hora
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    };

    const processChartData = () => {
        const dailyData: Record<string, Record<string, number>> = {}; // date: { category: time }

        tasks.forEach(task => {
            if (!task.created_at || !task.category?.name) return;
            const date = new Date(task.created_at).toLocaleDateString();
            const category = task.category.name;
            const timeSpent = task.time_spent || 0;

            if (!dailyData[date]) {
                dailyData[date] = {};
            }

            if (!dailyData[date][category]) {
                dailyData[date][category] = 0;
            }
            dailyData[date][category] += timeSpent;

        });

        const chartData = Object.entries(dailyData).map(([date, categories]) => {
            const dataPoint: ChartData = { date };

            Object.entries(categories).forEach(([category, time]) => {
                dataPoint[category] = time / 60; // Convert to minutes
            })
            return dataPoint;
        });

        return chartData;
    };

    useEffect(() => {
        setChartData(processChartData())
    }, [tasks]);



    return (
        <div className={`min-h-screen p-6 flex flex-col items-center ${styles.mainContainer}`}>
            <Link href="/">
                <img
                    src="./images/timi.png"
                    alt="Logo de Timi"
                    className="w-50 h-24 cursor-pointer"
                />
            </Link>
            <h1 className={styles.title}>Tareas</h1>

            <form onSubmit={createTask} className={styles.formWrapper}>
                <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.customInput}
                />

                <select
                    value={selectedCategory === null ? "" : selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                    className={styles.customInput}
                >
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No hay categorías</option>
                    )}

                </select>

                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Crear Tarea
                </button>
            </form>
            <div style={{ width: '100%', height: 400, marginTop: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Minutes Spent', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        {categories.map(category => (
                            <Bar key={category.id} dataKey={category.name} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} /> // Generates random colors
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.gridTasks}>
                {tasks
                    .slice()
                    .sort((a, b) => {
                         if (!a.created_at || !b.created_at) return 0;
                         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    })
                    .map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onStart={() => startTask(task.id)}
                            onPause={() => pauseTask(task.id)}
                            onFinish={() => finishTask(task.id)}
                            onDelete={() => deleteTask(task.id)}
                            formattedTime={formatTime(task.time_spent)}
                        />
                    ))}
            </div>
        </div>
    );
}