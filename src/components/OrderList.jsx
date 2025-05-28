import API from '../services/api';
import { useState } from 'react';

const BACKEND_URL = "http://localhost:5000";

const OrderList = ({ orders }) => {
  const [verifying, setVerifying] = useState(null);

  const handleVerify = async (order_id) => {
    setVerifying(order_id);
    try {
      await API.patch(`/orders/${order_id}/status`, { status: 'Terverifikasi' });
      window.location.reload();
    } catch (err) {
      alert('Gagal verifikasi pembayaran');
    } finally {
      setVerifying(null);
    }
  };

  if (!orders || orders.length === 0) {
    return <div className="mt-4 text-gray-500">Belum ada order.</div>;
  }

  return (
    <ul className="space-y-2">
      {orders.map((o) => (
        <li key={o.order_id} className="p-3 bg-white rounded shadow flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Order #{o.order_id} - {o.customer_name}</p>
              <p className="text-sm text-gray-600">on {new Date(o.order_date).toLocaleDateString()}</p>
              <p className="text-sm">Status: <span className="font-semibold">{o.status || '-'}</span></p>
            </div>
            {o.payment_proof && (
              <a href={`${BACKEND_URL}${o.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-4">Lihat Bukti</a>
            )}
          </div>
          {o.status === 'Sudah Dibayar' && o.payment_proof && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-max"
              onClick={() => handleVerify(o.order_id)}
              disabled={verifying === o.order_id}
            >
              {verifying === o.order_id ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
