import React, { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import styles from '../pagesStyles/categories.module.css';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${baseUrl}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;

    try {
      const res = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Categoría creada');
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      alert(data.message || data.detail || data.error || 'Categoría eliminada');
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center ${styles.container}`}>
      <h1 className={styles.title}>Categorías</h1>

      <form onSubmit={createCategory} className={styles.formContainer}>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className={styles.customInput}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear
        </button>
      </form>

      <div className={styles.gridContainer}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            categoryName={cat.name}
            onDelete={() => deleteCategory(cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
