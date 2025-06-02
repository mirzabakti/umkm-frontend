import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null); // State to track which payment is being updated

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await API.get('/api/payments', config);
        setPayments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching payments:', err);
         if (err.response && (err.response.status === 401 || err.response.status === 403)){
             setError('Akses ditolak. Pastikan Anda login sebagai Admin atau Owner.');
         } else {
            setError('Gagal memuat data pembayaran.');
         }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // Empty dependency array means this runs once on mount

  // Handler to update payment status
  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
      if (!window.confirm(`Apakah Anda yakin ingin mengubah status pembayaran #${paymentId} menjadi '${newStatus}'?`)) {
          return;
      }

      setUpdatingStatus(paymentId); // Set loading state for this specific payment

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
          const response = await API.patch(`/api/payments/${paymentId}/status`, { status: newStatus }, config);
          console.log('Payment status updated successfully:', response.data);
          // TODO: Show success message to user

          // Update the specific payment in the local state
          setPayments(payments.map(p => 
              p.payment_id === paymentId ? response.data : p
          ));

      } catch (err) {
          console.error('Error updating payment status:', err);
          // TODO: Show error message to user
          alert(`Gagal mengupdate status pembayaran: ${err.response?.data?.message || err.message}`);
      } finally {
          setUpdatingStatus(null); // Unset loading state
      }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">Memuat data pembayaran...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 text-red-600">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manajemen Pembayaran</h1>
        
        {payments.length === 0 ? (
            <p>Belum ada data pembayaran.</p>
        ) : (
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID Pembayaran</th>
                        <th className="py-2 px-4 border-b">ID Order</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Metode Pembayaran</th>
                        <th className="py-2 px-4 border-b">Jumlah</th>
                        <th className="py-2 px-4 border-b">Tanggal Pembayaran</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Bukti Pembayaran</th>
                        <th className="py-2 px-4 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.payment_id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{payment.payment_id}</td>
                            <td className="py-2 px-4 border-b text-center">{payment.order_id}</td>
                            <td className="py-2 px-4 border-b text-center">{payment.customer_name || '-'}</td>
                            <td className="py-2 px-4 border-b text-center">{payment.payment_method}</td>
                            <td className="py-2 px-4 border-b text-center">{payment.amount}</td>
                            <td className="py-2 px-4 border-b text-center">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}</td>
                             <td className="py-2 px-4 border-b text-center">
                                {/* Tombol aksi seperti Verifikasi/Update Status */}
                                {/* Tombol Verifikasi hanya muncul jika status Menunggu Verifikasi */}
                                {payment.status === 'Menunggu Verifikasi' && (
                                     <button
                                         className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                                         onClick={() => handleUpdatePaymentStatus(payment.payment_id, 'Terverifikasi')}
                                         disabled={updatingStatus === payment.payment_id}
                                     >
                                         {updatingStatus === payment.payment_id ? 'Updating...' : 'Verifikasi'}
                                     </button>
                                )}
                                {/* Tombol Tolak (Opsional) */}
                                {payment.status === 'Menunggu Verifikasi' && (
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleUpdatePaymentStatus(payment.payment_id, 'Ditolak')}
                                         disabled={updatingStatus === payment.payment_id}
                                    >
                                        {updatingStatus === payment.payment_id ? 'Updating...' : 'Tolak'}
                                    </button>
                                )}
                                {/* Tampilkan status jika sudah diverifikasi/ditolak */}
                                {payment.status !== 'Menunggu Verifikasi' && (
                                     <span>{payment.status}</span>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {payment.payment_proof_path ? (
                                     <a href={`http://localhost:5000${payment.payment_proof_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat</a>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </>
  );
};

export default PaymentsPage; 