import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700" onClick={() => alert('Fitur checkout akan segera hadir!')}>
        Checkout
      </button>
    </div>
  );
};

export default Cart; 