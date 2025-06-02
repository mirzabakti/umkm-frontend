import React, { useState, useEffect } from 'react';

const DeliveryForm = ({ order, delivery, onSubmit, onCancel }) => {
  const [status, setStatus] = useState('Pending Shipment'); // Default status
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

   // Load delivery data for editing or use default for creation
   useEffect(() => {
       if (delivery) {
           // If editing, populate form with existing delivery data
           setStatus(delivery.status || 'Pending Shipment');
           setTrackingNumber(delivery.tracking_number || '');
           setShippingAddress(delivery.shipping_address || '');
           setCity(delivery.city || '');
           setPostalCode(delivery.postal_code || '');
           setCountry(delivery.country || '');
       } else if (order && order.customer) {
           // If creating and order has customer address, pre-fill
           // TODO: Ensure backend /orders endpoint returns customer address
           // setShippingAddress(order.customer.address || '');
           // setCity(order.customer.city || '');
           // setPostalCode(order.customer.postal_code || '');
           // setCountry(order.customer.country || '');
       } else {
           // Default initial state for creation without customer address
           setStatus('Pending Shipment');
           setTrackingNumber('');
           setShippingAddress('');
           setCity('');
           setPostalCode('');
           setCountry('');
       }
   }, [delivery, order]); // Rerun effect if delivery or order changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!shippingAddress || !city || !postalCode || !country) {
        alert('Alamat pengiriman, kota, kode pos, dan negara tidak boleh kosong.');
        setLoading(false);
        return;
    }

    const deliveryData = {
      status: status,
      tracking_number: trackingNumber || null, // Send null if empty
      shipping_address: shippingAddress,
      city: city,
      postal_code: postalCode,
      country: country,
      // delivery_date is set in backend using NOW()
    };

    // If editing, add the delivery_id to the data
    if (delivery && delivery.delivery_id) {
        deliveryData.delivery_id = delivery.delivery_id;
    } else if (order && order.order_id) {
        // If creating, add the order_id
        deliveryData.order_id = order.order_id;
    } else {
        // Should not happen if used correctly, but good fallback
        alert('Order or Delivery information missing.');
        setLoading(false);
        return;
    }

    onSubmit(deliveryData);
    // onSubmit should handle setLoading(false) and hiding the form on success/failure
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">{delivery ? `Edit Pengiriman #${delivery.delivery_id}` : `Buat Pengiriman untuk Order #${order.order_id}`}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status Pengiriman</label>
            {/* Status could be a dropdown in a real app */}
            <input
              type="text"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled // Status awal bisa diatur di backend atau tidak diizinkan diubah saat pembuatan
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trackingNumber">Nomor Resi (Opsional)</label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippingAddress">Alamat Pengiriman</label>
            <input
              type="text"
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4 flex gap-4">
             <div className="flex-1">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">Kota</label>
                 <input
                     type="text"
                     id="city"
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     required
                 />
             </div>
              <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">Kode Pos</label>
                 <input
                     type="text"
                     id="postalCode"
                     value={postalCode}
                     onChange={(e) => setPostalCode(e.target.value)}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     required
                 />
              </div>
          </div>

           <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Negara</label>
             <input
                 type="text"
                 id="country"
                 value={country}
                 onChange={(e) => setCountry(e.target.value)}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 required
             />
           </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : (delivery ? 'Update Pengiriman' : 'Buat Pengiriman')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              disabled={loading}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm; 