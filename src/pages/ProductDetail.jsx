import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

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
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Produk tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
    </div>
  );
};

export default ProductDetail; 