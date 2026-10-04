'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newCategoryName.trim()) return;

    try {
      const response = await api.post('/categories', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category.');
    }
  };

  //Save Renamed Category
  const handleUpdateCategory = async (id: number) => {
    if (!editCategoryName.trim()) {
      setEditingId(null);
      return;
    }
    setError('');

    try {
      const response = await api.patch(`/categories/${id}`, { name: editCategoryName });
      // Update the category in local list instantly
      setCategories(categories.map(cat => (cat.id === id ? response.data : cat)));
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to rename category.');
    }
  };

  
  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditCategoryName(category.name);
    setError('');
  };

  const handleDeleteCategory = async (id: number) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
          <Link href="/dashboard" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium">
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleCreateCategory} className="flex gap-4">
            <input
              type="text"
              required
              placeholder="e.g., Subscriptions, Gaming"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition font-medium">
              Add Category
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No categories found.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                  
                  {editingId === category.id ? (
                    <div className="flex-1 flex gap-3 mr-4">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleUpdateCategory(category.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="font-medium text-gray-800 flex-1">{category.name}</span>
                  )}

                  {/* Hide Edit/Delete buttons */}
                  {editingId !== category.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm px-3 py-1 border border-transparent hover:border-blue-200 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 border border-transparent hover:border-red-200 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
