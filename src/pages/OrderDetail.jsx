import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail pesanan');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!order) return <div className="text-center p-4">Pesanan tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Detail Pesanan #{order.order_id}</h1>
      <div className="mb-4">Tanggal: {new Date(order.order_date).toLocaleString()}</div>
      <div className="mb-4">Status: <span className="font-semibold">{order.status || '-'}</span></div>
      <div className="mb-4">Nama Customer: {order.customer_name}</div>
      <h2 className="text-xl font-semibold mb-2">Daftar Produk</h2>
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Produk</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Harga</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.product_id} className="border-b">
              <td className="p-2">{item.product_name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">Rp {item.price.toLocaleString()}</td>
              <td className="p-2">Rp {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/orders/history" className="text-blue-600 hover:underline">Kembali ke Riwayat</Link>
    </div>
  );
};

export default OrderDetail; 