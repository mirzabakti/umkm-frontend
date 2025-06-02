import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Payment = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch order details (assuming token is handled elsewhere or not needed here for order detail)
        const orderRes = await API.get(`/orders/${order_id}`); 
        setOrder(orderRes.data);

        // Fetch payment record for this order
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          const paymentRes = await API.get(`/api/payments/order/${order_id}`, config); // Include config with token
          if (paymentRes.data && paymentRes.data.payment_proof_path) {
              setProofUrl(`http://localhost:5000${paymentRes.data.payment_proof_path}`);
          }
        } catch (paymentErr) {
            // 404 is expected if no payment record exists yet
            if (paymentErr.response && paymentErr.response.status === 404) {
                console.log('No payment record found for this order yet.');
            } else {
                 console.error('Error fetching payment record:', paymentErr);
                 setError('Gagal memuat data pembayaran terkait.');
            }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Gagal memuat detail pesanan');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order_id]);

  const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      if (!order) {
          setError('Detail pesanan belum dimuat.');
          return;
      }

      // Although backend allows creation without file, for payment proof, file is required.
      if (!file) {
          alert('Mohon unggah bukti pembayaran.');
          return;
      }

      setUploading(true); // Use uploading state for the whole process
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('order_id', order.order_id);
      // Assuming payment method is fixed for now, or add an input for it
      formData.append('payment_method', 'Bank Transfer'); 
      formData.append('amount', order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)); // Get total amount from order
      formData.append('payment_date', new Date().toISOString()); // Use current date
      formData.append('payment_proof', file);

      try {
          // Send data to the new payment endpoint
          const token = localStorage.getItem('token');
          const config = {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
              },
          };
          await API.post('/api/payments', formData, config);

          setSuccess('Bukti pembayaran berhasil diupload dan pembayaran dikonfirmasi!');
          // Optionally update order status here if not done by backend trigger
          // await API.patch(`/orders/${order.order_id}/status`, { status: 'Menunggu Verifikasi Pembayaran' }); // Contoh
          
          // Fetch updated order/payment info or redirect
          setTimeout(() => navigate(`/order/${order.order_id}`), 1500); // Redirect to order detail

      } catch (err) {
          console.error('Error submitting payment:', err);
          console.error('Error response data:', err.response?.data);
          setError('Gagal mengirim data pembayaran.');
      } finally {
          setUploading(false);
      }
  };

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

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pembayaran Pesanan #{order.order_id}</h1>
        <div className="mb-4">Tanggal: {new Date(order.order_date).toLocaleString()}</div>
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
        <div className="text-xl font-bold mb-6">Total: Rp {total.toLocaleString()}</div>
        
        {/* Modified form to handle both file upload and payment submission */}
        <form onSubmit={handlePaymentSubmit} className="mb-4">
          <label className="block mb-2 font-semibold">Unggah Bukti Pembayaran (jpg/png/pdf):</label>
          <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} className="mb-2" required />
          {/* Optional: Add input for payment method if needed */}
          {file && <p className="text-sm text-gray-600 mb-2">File dipilih: {file.name}</p>}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={uploading}>
            {uploading ? 'Mengirim...' : 'Konfirmasi & Unggah Pembayaran'}
          </button>
        </form>

        {proofUrl && (
          <div className="mb-4">
            <div className="font-semibold mb-1">Bukti Pembayaran (dari catatan pembayaran sebelumnya):</div>
            <img src={proofUrl} alt="Bukti Pembayaran" className="max-w-xs border rounded" />
          </div>
        )}
        
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

        <Link to="/orders/history" className="text-blue-600 hover:underline">Lihat Riwayat Pesanan</Link>
      </div>
    </>
  );
};

export default Payment; 