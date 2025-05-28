import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

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
        const res = await API.get(`/orders/${order_id}`);
        setOrder(res.data);
        if (res.data.payment_proof) setProofUrl(res.data.payment_proof);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail pesanan');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order_id]);

  const handleConfirmPayment = async () => {
    try {
      await API.patch(`/orders/${order_id}/status`, { status: 'Sudah Dibayar' });
      setSuccess('Pembayaran berhasil dikonfirmasi!');
      setTimeout(() => navigate(`/order/${order_id}`), 1200);
    } catch (err) {
      setError('Gagal konfirmasi pembayaran');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);
      const res = await API.patch(`/orders/${order_id}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProofUrl(res.data.payment_proof);
      setSuccess('Bukti pembayaran berhasil diupload!');
    } catch (err) {
      setError('Gagal upload bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!order) return <div className="text-center p-4">Pesanan tidak ditemukan</div>;

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
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
      <form onSubmit={handleUpload} className="mb-4">
        <label className="block mb-2 font-semibold">Upload Bukti Pembayaran (jpg/png):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={uploading}>
          {uploading ? 'Mengupload...' : 'Upload Bukti'}
        </button>
      </form>
      {proofUrl && (
        <div className="mb-4">
          <div className="font-semibold mb-1">Bukti Pembayaran:</div>
          <img src={proofUrl} alt="Bukti Pembayaran" className="max-w-xs border rounded" />
        </div>
      )}
      {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4"
        onClick={handleConfirmPayment}
      >
        Konfirmasi Pembayaran
      </button>
      <Link to="/orders/history" className="text-blue-600 hover:underline">Lihat Riwayat Pesanan</Link>
    </div>
  );
};

export default Payment; 