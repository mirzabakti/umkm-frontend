import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import ProductReviewForm from '../components/ProductReviewForm'; // Import the form component

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // State for product reviews
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true); // Loading state for reviews
  const [error, setError] = useState('');
  const [reviewsError, setReviewsError] = useState(null); // Error state for reviews
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false); // State for wishlist status
  const { addToCart } = useCart();

  // Get user from localStorage to check role and customer_id
  const user = JSON.parse(localStorage.getItem('user'));
  const isCustomer = user && user.role === 'customer';
  const customer_id = user?.customer_id; // Get customer_id
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
        // After product is fetched, check wishlist status
        checkWishlistStatus(res.data); // Pass product data to checkWishlistStatus
      } catch (err) {
        setError('Gagal memuat detail produk');
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const reviewsRes = await API.get(`/product-reviews?product_id=${id}`);
            setReviews(reviewsRes.data);
            setReviewsError(null);
        } catch (err) {
            console.error('Error fetching product reviews:', err);
            setReviewsError('Gagal memuat ulasan produk.');
        } finally {
            setLoadingReviews(false);
        }
    };

    const checkWishlistStatus = async (productData) => {
        if (!isCustomer || !customer_id || !token || !productData) return; // Only check if customer is logged in and productData is available
        try {
             const config = { headers: { Authorization: `Bearer ${token}` } };
             const wishlistRes = await API.get(`/wishlists/${customer_id}`, config);
             const wishlisted = wishlistRes.data.some(item => item.product_id === productData.product_id); // Use productData
             setIsWishlisted(wishlisted);

        } catch (err) {
            console.error('Error checking wishlist status:', err);
            setIsWishlisted(false);
        }
    };

    fetchProduct();
    fetchReviews();

  }, [id, isCustomer, customer_id, token]); // Corrected dependencies

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Function to handle adding a new review
  const handleAddReview = async (reviewData) => {
      try {
          if (!reviewData.customer_id) {
              console.error('Customer ID is missing for review submission.');
              return;
          }
          const token = localStorage.getItem('token');
          const config = {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          };
          await API.post('/product-reviews', reviewData, config);
          console.log('Review submitted successfully!');
          fetchReviews();
      } catch (err) {
          console.error('Error submitting review:', err);
      }
  };

   const handleWishlistToggle = async () => {
        // debugger;
       if (!isCustomer || !customer_id || !token || !product) { // Add check for product
           alert('Anda harus login sebagai customer dan produk harus dimuat untuk menambahkan ke wishlist.');
           return;
       }

       try {
           const config = { headers: { Authorization: `Bearer ${token}` } };

           if (isWishlisted) {
               // Remove from wishlist
                const wishlistRes = await API.get(`/wishlists/${customer_id}`, config);
                const wishlistItem = wishlistRes.data.find(item => item.product_id === product.product_id);

                if (wishlistItem) {
                     await API.delete(`/wishlists/${wishlistItem.wishlist_id}`, config);
                     console.log('Removed from wishlist!');
                     setIsWishlisted(false);
                }

           } else {
               // Add to wishlist
                const newWishlistItem = { product_id: product.product_id, customer_id: customer_id };
                await API.post('/wishlists', newWishlistItem, config);
                console.log('Added to wishlist!');
                setIsWishlisted(true);
           }
       } catch (err) {
           console.error('Error toggling wishlist status:', err);
       }
   };


  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Produk tidak ditemukan</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={product.image_url || 'https://via.placeholder.com/600x400'}
            alt={product.product_name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
            <p className="text-2xl text-gray-800 mb-4">Rp {product.price.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">Stok: {product.stock}</p>
            <p className="text-gray-700 mb-6">{product.description || 'Tidak ada deskripsi'}</p>
            
            {/* Add to Cart and Add to Wishlist buttons */}
            <div className="flex space-x-4 mb-4">
                <button
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  onClick={handleAddToCart}
                >
                  Tambah ke Cart
                </button>

                 {/* Wishlist Button (conditionally rendered for customers) */}
                {isCustomer && (
                    <button
                         className={`flex-1 py-3 rounded-lg ${isWishlisted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                         onClick={handleWishlistToggle}
                    >
                       {isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                    </button>
                )}
            </div>

            {added && <div className="mt-3 text-green-600 text-center">Ditambahkan ke keranjang!</div>}
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4">Ulasan Produk</h2>

            {/* Review Form (conditionally rendered for logged-in customers) */}
            {isCustomer && user?.customer_id && (
                 <ProductReviewForm onSubmit={handleAddReview} product_id={product.product_id} />
            )}
             {!isCustomer && user && ( // Logged in but not a customer
                  <p className="mb-4 text-gray-600">Anda harus login sebagai customer untuk memberikan ulasan.</p>
             )}
              {!user && ( // Not logged in
                   <p className="mb-4 text-gray-600">Login untuk memberikan ulasan.</p>
              )}

            {loadingReviews ? (
                <p>Memuat ulasan...</p>
            ) : reviewsError ? (
                <p className="text-red-600">{reviewsError}</p>
            ) : reviews.length === 0 ? (
                <p>Belum ada ulasan untuk produk ini.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {reviews.map(review => (
                        <li key={review.review_id} className="py-4">
                            <div className="flex justify-between">
                                <p className="font-semibold">{review.customer_name}</p>
                                <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-yellow-500 mb-2">Rating: {review.rating}/5</div> {/* Basic rating display */}
                            <p className="text-gray-700">{review.comment}</p>
                             {/* TODO: Add Edit/Delete buttons for the review author or admin/owner */}
                        </li>
                    ))}
                </ul>
            )}
        </div>

      </div>
    </>
  );
};

export default ProductDetail; 