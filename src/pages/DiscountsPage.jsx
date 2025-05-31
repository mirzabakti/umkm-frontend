import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DiscountForm from '../components/DiscountForm'; // Import the form component

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDiscount, setEditingDiscount] = useState(null); // State to hold discount being edited

  const API_URL = 'http://localhost:5000/discounts'; // Adjust if your backend runs on a different URL/port

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setDiscounts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Gagal mengambil data diskon.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiscount = async (newDiscountData) => {
    try {
      await axios.post(API_URL, newDiscountData);
      fetchDiscounts(); // Refresh the list after adding
    } catch (err) {
      console.error('Error adding discount:', err);
      // Handle errors, maybe show a message to the user
    }
  };

   const handleEditClick = (discount) => {
    setEditingDiscount(discount); // Set the discount to be edited when Edit button is clicked
  };

   const handleEditDiscount = async (updatedDiscountData) => {
       try {
           await axios.put(`${API_URL}/${editingDiscount.discount_id}`, updatedDiscountData);
           setEditingDiscount(null); // Clear editing state after successful update
           fetchDiscounts(); // Refresh the list after updating
       } catch (err) {
           console.error('Error updating discount:', err);
            // Handle errors
       }
   };

   const handleDeleteDiscount = async (discountId) => {
       try {
           // Confirm deletion with user
           if (window.confirm('Apakah Anda yakin ingin menghapus diskon ini?')) {
               await axios.delete(`${API_URL}/${discountId}`);
               fetchDiscounts(); // Refresh the list after deleting
           }
       } catch (err) {
           console.error('Error deleting discount:', err);
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
      <h1 className="text-2xl font-bold mb-4">Kelola Diskon</h1>
      
      {/* Form for adding/editing */}
      <DiscountForm onSubmit={editingDiscount ? handleEditDiscount : handleAddDiscount} editingDiscount={editingDiscount} />

       {/* Button to cancel editing */}
      {editingDiscount && (
          <button 
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
              onClick={() => setEditingDiscount(null)}
          >
              Batal Edit
          </button>
      )}

      <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Daftar Diskon</h2>
          {discounts.length === 0 ? (
              <p>Tidak ada diskon.</p>
          ) : (
              <ul className="divide-y divide-gray-200">
                  {discounts.map(discount => (
                      <li key={discount.discount_id} className="py-3 flex justify-between items-center">
                          <div>
                              Diskon {discount.discount_percentage}%:
                              {discount.product_name && ` untuk produk ${discount.product_name}`}
                              {discount.discount_category_name && ` untuk kategori ${discount.discount_category_name}`}
                              {` ( ${new Date(discount.start_date).toLocaleDateString()} - ${new Date(discount.end_date).toLocaleDateString()} )`}
                          </div>
                          <div>
                              {/* Edit button */}
                              <button
                                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                  onClick={() => handleEditClick(discount)}
                              >
                                  Edit
                              </button>
                              {/* Delete button */}
                              <button
                                  className="bg-red-600 text-white px-3 py-1 rounded"
                                   onClick={() => handleDeleteDiscount(discount.discount_id)}
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

export default DiscountsPage; 