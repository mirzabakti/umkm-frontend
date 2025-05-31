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
  const { addToCart } = useCart();

  // Get user from localStorage to check role and customer_id
  const user = JSON.parse(localStorage.getItem('user'));
  const isCustomer = user && user.role === 'customer';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
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

    fetchProduct();
    fetchReviews();

  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Function to handle adding a new review
  const handleAddReview = async (reviewData) => {
      try {
          // Make sure customer_id is included (though it's also fetched in the form)
          if (!reviewData.customer_id) {
              console.error('Customer ID is missing for review submission.');
               // TODO: Show error to user
              return;
          }
           // Pass the JWT token for authentication
          const token = localStorage.getItem('token');
          const config = {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          };
          
          await API.post('/product-reviews', reviewData, config);
          console.log('Review submitted successfully!');
          // Refresh the reviews list after successful submission
          fetchReviews();
          // TODO: Show success message to user
      } catch (err) {
          console.error('Error submitting review:', err);
          // TODO: Handle specific backend validation errors if needed
           // TODO: Show error message to user
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
            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              onClick={handleAddToCart}
            >
              Tambah ke Cart
            </button>
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