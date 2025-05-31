import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
// import API from '../services/api'; // Assume API is used for authenticated calls

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from localStorage to check role and customer_id
  const user = JSON.parse(localStorage.getItem('user'));
  const customer_id = user?.customer_id; // Use optional chaining
  const token = localStorage.getItem('token');

  const API_URL = `http://localhost:5000/wishlists/${customer_id}`; // API endpoint for this customer's wishlist
  const API_BASE_URL = 'http://localhost:5000'; // Base URL for other API calls

  useEffect(() => {
    // Only fetch if customer_id and token are available
    if (customer_id && token) {
      fetchWishlist();
    } else {
      // If not logged in as customer, show error immediately
       if (!user) {
            setError('Anda harus login untuk melihat wishlist.');
       } else if (user.role !== 'customer') {
            setError('Anda harus login sebagai customer untuk melihat wishlist.');
       }
       setLoading(false); // Stop loading if not authorized
    }
  }, [customer_id, token]); // <-- Removed 'user' from dependencies

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const config = { // Include token for authentication
             headers: {
                 Authorization: `Bearer ${token}`
             }
         };
      // Check if customer_id is available before making the API call
       if (customer_id) {
            const response = await axios.get(API_URL, config);
            setWishlistItems(response.data);
            setError(null);
       } else {
            // This case should ideally be caught by the useEffect check, but as a fallback:
           setError('ID Customer tidak ditemukan.');
           setLoading(false);
       }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)){
           setError('Akses ditolak. Anda mungkin perlu login kembali.');
      } else {
         setError('Gagal mengambil data wishlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (wishlistItemId) => {
      try {
           if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari wishlist?')) {
               const config = { // Include token for authentication
                   headers: {
                       Authorization: `Bearer ${token}`
                   }
               };
               await axios.delete(`${API_BASE_URL}/wishlists/${wishlistItemId}`, config);
               console.log('Item removed from wishlist!');
               fetchWishlist(); // Refresh the list after removing
           }
      } catch (err) {
          console.error('Error removing item from wishlist:', err);
           // TODO: Handle errors and show message to user
      }
  };


  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  // Check if user is logged in and is a customer before rendering the list
   if (!user || user.role !== 'customer') {
        // This case is handled by the initial error state, but added here for clarity
       return <div className="container mx-auto p-4 text-red-600">Anda harus login sebagai customer untuk melihat wishlist.</div>;
   }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Wishlist Saya</h1>
        
        {wishlistItems.length === 0 ? (
            <p>Wishlist Anda kosong.</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {wishlistItems.map(item => (
                    <li key={item.wishlist_id} className="py-4 flex justify-between items-center">
                         {/* Display product details */}
                        <div>
                             <span className="font-semibold">{item.product_name}</span> - Rp {item.price.toLocaleString()}
                              {/* Optional: display product image */}
                             {/* {item.image_url && <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover mr-4" />} */}
                        </div>
                        <div>
                            {/* Remove button */}
                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => handleRemoveItem(item.wishlist_id)}
                            >
                                Hapus
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </>
  );
};

export default WishlistPage; 