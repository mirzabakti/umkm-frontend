import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useState } from 'react';

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'customer') {
        setMessage('Anda harus login sebagai customer untuk checkout.');
        setLoading(false);
        return;
      }
      // Ambil customer_id dari user_id
      const res = await API.get(`/customers/user/${user.id}`);
      const customer_id = res.data.customer_id;
      // Siapkan data order
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.qty,
        price: item.price
      }));
      await API.post('/orders', { customer_id, items });
      clearCart();
      setMessage('Checkout berhasil! Pesanan Anda telah dibuat.');
      setTimeout(() => navigate('/catalog'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
        <p>Keranjang masih kosong.</p>
        <Link to="/catalog" className="text-blue-600 hover:underline">Lihat Katalog</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
      {message && <div className="mb-4 text-center text-green-600">{message}</div>}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Produk</th>
            <th className="p-2">Harga</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Subtotal</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.product_id} className="border-b">
              <td className="p-2">{item.product_name}</td>
              <td className="p-2">Rp {item.price.toLocaleString()}</td>
              <td className="p-2">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={e => updateQty(item.product_id, parseInt(e.target.value) || 1)}
                  className="w-16 border rounded px-2 py-1"
                />
              </td>
              <td className="p-2">Rp {(item.price * item.qty).toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mb-6">
        <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Kosongkan Keranjang</button>
        <div className="text-xl font-bold">Total: Rp {total.toLocaleString()}</div>
      </div>
      <button
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Checkout'}
      </button>
    </div>
  );
};

export default Cart; 