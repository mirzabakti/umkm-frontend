import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const DeliveryDetail = () => {
  const { deliveryId } = useParams(); // Get deliveryId from URL
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await API.get(`/deliveries/${deliveryId}`, config);
        setDelivery(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setError('Akses ditolak. Anda tidak memiliki izin untuk melihat detail pengiriman ini atau sesi Anda sudah habis.');
        } else if (err.response && err.response.status === 404) {
             setError('Detail pengiriman tidak ditemukan.');
        } else {
           setError('Gagal memuat detail pengiriman.');
        }
        setDelivery(null); // Clear previous data on error
      } finally {
        setLoading(false);
      }
    };

    if (deliveryId) {
        fetchDelivery();
    } else {
        setError('ID Pengiriman tidak ditemukan di URL.');
        setLoading(false);
    }

  }, [deliveryId]); // Rerun effect if deliveryId changes

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">Memuat detail pengiriman...</div>
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

  if (!delivery) {
      return (
          <>
            <Navbar />
            <div className="container mx-auto p-4">Detail pengiriman tidak tersedia.</div>
          </>
      );
  }

  // Render delivery details
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Detail Pengiriman #{delivery.delivery_id}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p><span className="font-semibold">ID Order:</span> {delivery.order_id}</p>
                <p><span className="font-semibold">Status:</span> {delivery.status}</p>
                <p><span className="font-semibold">Nomor Resi:</span> {delivery.tracking_number || '-'}</p>
                <p><span className="font-semibold">Tanggal Pengiriman:</span> {delivery.shipping_date ? new Date(delivery.shipping_date).toLocaleDateString() : '-'}</p>
                <p><span className="font-semibold">Dibuat Pada:</span> {new Date(delivery.created_at).toLocaleString()}</p>
                <p><span className="font-semibold">Diupdate Pada:</span> {new Date(delivery.updated_at).toLocaleString()}</p>
            </div>
            <div>
                <p className="font-semibold mb-2">Alamat Pengiriman:</p>
                <p>{delivery.shipping_address}</p>
                <p>{delivery.city}, {delivery.postal_code}</p>
                <p>{delivery.country}</p>
            </div>
        </div>

        {/* Tambahkan tombol atau info lain jika perlu */}

      </div>
    </>
  );
};

export default DeliveryDetail; 