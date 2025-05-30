import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'customer') {
          setError('Anda harus login sebagai customer untuk melihat riwayat pesanan.');
          setLoading(false);
          return;
        }
        // Ambil customer_id dari user_id
        const resCustomer = await API.get(`/customers/user/${user.id}`);
        const customer_id = resCustomer.data.customer_id;
        // Ambil daftar order
        const resOrders = await API.get(`/orders/customer/${customer_id}`);
        setOrders(resOrders.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat riwayat pesanan');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center p-4">Loading...</div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="text-center text-red-500 p-4">{error}</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>
        {orders.length === 0 ? (
          <div className="text-center">Belum ada pesanan.</div>
        ) : (
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Order ID</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.order_id} className="border-b">
                  <td className="p-2">{order.order_id}</td>
                  <td className="p-2">{new Date(order.order_date).toLocaleString()}</td>
                  <td className="p-2">{order.status || '-'}</td>
                  <td className="p-2">
                    <Link to={`/order/${order.order_id}`} className="text-blue-600 hover:underline">Lihat Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/catalog" className="text-blue-600 hover:underline">Kembali ke Katalog</Link>
      </div>
    </>
  );
};

export default OrderHistory; 