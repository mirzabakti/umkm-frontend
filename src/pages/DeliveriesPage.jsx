import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import DeliveryForm from '../components/DeliveryForm';

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await API.get('/deliveries', config);
        setDeliveries(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
         if (err.response && (err.response.status === 401 || err.response.status === 403)){
             setError('Akses ditolak. Pastikan Anda login sebagai Admin atau Owner.');
         } else {
            setError('Gagal memuat data pengiriman.');
         }
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []); // Empty dependency array means this runs once on mount

  // Handler for Detail button
  const handleDetail = (deliveryId) => {
    navigate(`/deliveries/${deliveryId}`);
  };

  // Handler for Edit button
  const handleEdit = (delivery) => {
    console.log('Edit button clicked for delivery:', delivery);
    setEditingDelivery(delivery);
    setShowEditForm(true);
  };

  // Handler for Delete button
  const handleDelete = async (deliveryId) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await API.delete(`/deliveries/${deliveryId}`, config);
        console.log('Delivery deleted successfully!');
        // Update state to remove the deleted delivery
        setDeliveries(deliveries.filter(delivery => delivery.delivery_id !== deliveryId));
      } catch (error) {
        console.error('Error deleting delivery:', error);
        alert('Gagal menghapus pengiriman.'); // Show error message from catch
      }
    }
  };

  // Handler for cancelling the edit form
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingDelivery(null);
  };

  // Handler for submitting the edit form
  const handleUpdateDelivery = async (updatedData) => {
      setLoading(true); // Set loading state
      try {
        console.log('Attempting to update delivery:', updatedData);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Send PUT request to update the delivery
        console.log('Sending PUT request to:', `/deliveries/${editingDelivery.delivery_id}`);
        const response = await API.put(`/deliveries/${editingDelivery.delivery_id}`, updatedData, config);
        console.log('Delivery updated successfully!', response.data);

        // Update the specific delivery in the local state
        setDeliveries(deliveries.map(d => 
            d.delivery_id === editingDelivery.delivery_id ? response.data : d
        ));

        setShowEditForm(false); // Hide the form
        setEditingDelivery(null); // Clear editing delivery

      } catch (error) {
        console.error('Error updating delivery:', error);
        alert('Gagal mengupdate pengiriman.'); // Show error message
        console.error('Error details:', error);
      } finally {
          console.log('Finally block reached.');
          setLoading(false); // Unset loading state
      }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">Loading...</div>
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
        <h1 className="text-2xl font-bold mb-4">Manajemen Pengiriman</h1>
        
        {deliveries.length === 0 ? (
            <p>Belum ada data pengiriman.</p>
        ) : (
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID Pengiriman</th>
                        <th className="py-2 px-4 border-b">ID Order</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Nomor Resi</th>
                        <th className="py-2 px-4 border-b">Tanggal Pengiriman</th>
                        <th className="py-2 px-4 border-b">Alamat</th>
                        {/* Tambahkan kolom lain jika perlu */}
                        <th className="py-2 px-4 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries.map(delivery => (
                        <tr key={delivery.delivery_id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{delivery.delivery_id}</td>
                            <td className="py-2 px-4 border-b text-center">{delivery.order_id}</td>
                            <td className="py-2 px-4 border-b text-center">{delivery.status}</td>
                            <td className="py-2 px-4 border-b text-center">{delivery.tracking_number || '-'}</td>
                            <td className="py-2 px-4 border-b text-center">{delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleDateString() : '-'}</td>
                            <td className="py-2 px-4 border-b">{`${delivery.shipping_address}, ${delivery.city}, ${delivery.postal_code}, ${delivery.country}`}</td>
                            <td className="py-2 px-4 border-b text-center">
                                {/* Tombol aksi seperti Update atau Detail */}
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                                  onClick={() => handleDetail(delivery.delivery_id)}
                                >Detail</button>
                                <button
                                   className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                                   onClick={() => handleEdit(delivery)}
                                >Edit</button>
                                <button
                                   className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                   onClick={() => handleDelete(delivery.delivery_id)}
                                >Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>

      {/* Edit Form Modal (conditional rendering) */}
      {showEditForm && editingDelivery && (
          <DeliveryForm
              delivery={editingDelivery}
              onSubmit={handleUpdateDelivery}
              onCancel={handleCancelEdit}
          />
      )}

    </>
  );
};

export default DeliveriesPage; 