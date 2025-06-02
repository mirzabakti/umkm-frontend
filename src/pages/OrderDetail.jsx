import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderAndDelivery = async () => {
      try {
        const orderRes = await API.get(`/orders/${id}`);
        setOrder(orderRes.data);

        try {
          const deliveryRes = await API.get(`/deliveries/order/${id}`);
          setDelivery(deliveryRes.data);
        } catch (deliveryErr) {
          if (deliveryErr.response && deliveryErr.response.status === 404) {
            setDelivery(null);
            console.log('Delivery info not found for this order.');
          } else {
            console.error('Error fetching delivery info:', deliveryErr);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail pesanan');
        setLoading(false);
      }
    };
    fetchOrderAndDelivery();
  }, [id]);

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
  if (!order) return (
    <>
      <Navbar />
      <div className="text-center p-4">Pesanan tidak ditemukan</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Detail Pesanan #{order.order_id}</h1>
        <div className="mb-4">Tanggal: {new Date(order.order_date).toLocaleString()}</div>
        <div className="mb-4">Status: <span className="font-semibold">{order.status || '-'}</span></div>
        <div className="mb-4">Nama Customer: {order.customer_name}</div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Informasi Pengiriman</h2>
          {delivery ? (
            <>
              <div className="mb-2">Status Pengiriman: <span className="font-semibold">{delivery.status || '-'}</span></div>
              {delivery.delivery_date && <div className="mb-2">Tanggal Dikirim: {new Date(delivery.delivery_date).toLocaleDateString()}</div>}
              {delivery.tracking_number && <div className="mb-2">Nomor Resi: <span className="font-mono">{delivery.tracking_number}</span></div>}
              <div className="mb-2">Alamat: {delivery.shipping_address}, {delivery.city}, {delivery.postal_code}, {delivery.country}</div>
            </>
          ) : (
            <p>Informasi pengiriman belum tersedia.</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-2 mt-6">Daftar Produk</h2>
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
    </>
  );
};

export default OrderDetail; 