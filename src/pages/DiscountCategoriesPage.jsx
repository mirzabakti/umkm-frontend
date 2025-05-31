import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DiscountCategoryForm from '../components/DiscountCategoryForm'; // Import the form component

const DiscountCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // State to hold category being edited

  const API_URL = 'http://localhost:5000/discount-categories'; // Adjust if your backend runs on a different URL/port

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching discount categories:', err);
      setError('Gagal mengambil data kategori diskon.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategoryData) => {
    try {
      await axios.post(API_URL, newCategoryData);
      fetchCategories(); // Refresh the list after adding
    } catch (err) {
      console.error('Error adding discount category:', err);
      // Handle errors, maybe show a message to the user
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category); // Set the category to be edited when Edit button is clicked
  };

   const handleEditCategory = async (updatedCategoryData) => {
       try {
           await axios.put(`${API_URL}/${editingCategory.discount_category_id}`, updatedCategoryData);
           setEditingCategory(null); // Clear editing state after successful update
           fetchCategories(); // Refresh the list after updating
       } catch (err) {
           console.error('Error updating discount category:', err);
            // Handle errors
       }
   };

   const handleDeleteCategory = async (categoryId) => {
       try {
           // Confirm deletion with user
           if (window.confirm('Apakah Anda yakin ingin menghapus kategori diskon ini?')) {
               await axios.delete(`${API_URL}/${categoryId}`);
               fetchCategories(); // Refresh the list after deleting
           }
       } catch (err) {
           console.error('Error deleting discount category:', err);
            // Handle errors
       }
   };


  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kelola Kategori Diskon</h1>
      
      {/* Form for adding/editing */}
      <DiscountCategoryForm onSubmit={editingCategory ? handleEditCategory : handleAddCategory} editingCategory={editingCategory} />

      {/* Button to cancel editing */}
      {editingCategory && (
          <button 
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
              onClick={() => setEditingCategory(null)}
          >
              Batal Edit
          </button>
      )}

      <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Daftar Kategori</h2>
          {categories.length === 0 ? (
              <p>Tidak ada kategori diskon.</p>
          ) : (
              <ul className="divide-y divide-gray-200">
                  {categories.map(category => (
                      <li key={category.discount_category_id} className="py-3 flex justify-between items-center">
                          <span>{category.discount_category_name}</span>
                          <div>
                              {/* Edit button */}
                              <button
                                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                  onClick={() => handleEditClick(category)}
                              >
                                  Edit
                              </button>
                              {/* Delete button */}
                              <button
                                  className="bg-red-600 text-white px-3 py-1 rounded"
                                   onClick={() => handleDeleteCategory(category.discount_category_id)}
                              >
                                  Hapus
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>
          )}
      </div>
    </div>
  );
};

export default DiscountCategoriesPage; 