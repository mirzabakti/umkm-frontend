import { useEffect, useState } from 'react';
import API from '../services/api';
// import OrderForm from '../components/OrderForm'; // We won't use this form here for now
import OrderList from '../components/OrderList';
import Navbar from '../components/Navbar';
import DeliveryForm from '../components/DeliveryForm'; // Import the new form

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false); // State to control form visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store selected order
  const [creatingDelivery, setCreatingDelivery] = useState(false); // State for loading on form submission
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false); // State for status update modal visibility
  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState(null); // State for order being updated
  const [newStatus, setNewStatus] = useState(''); // State for the selected new status

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      // console.log('orders:', res.data); // Keep this console log for debugging if needed
      setOrders(res.data);
    } catch (error) {
       console.error('Error fetching orders:', error);
       // TODO: Show error message to user
    }
  };

  // Function called by OrderList when 'Buat Pengiriman' button is clicked
  const handleCreateDeliveryClick = (order) => {
     setSelectedOrder(order); // Store the selected order
     setShowDeliveryForm(true); // Show the delivery form
  };

  // Function called by OrderList when 'Update Status' button is clicked
  const handleUpdateStatusClick = (order) => {
      setOrderToUpdateStatus(order);
      setNewStatus(order.status || ''); // Initialize status with current status
      setShowStatusUpdateModal(true);
  };

  // Function called by DeliveryForm when submitted
  const handleDeliveryFormSubmit = async (deliveryData) => {
     setCreatingDelivery(true);
     try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
       await API.post('/deliveries', deliveryData, config);
       console.log('Delivery created successfully!');
        // TODO: Show success message to user

       // Update the order status in the local state to 'Diproses'
       setOrders(orders.map(o => 
           o.order_id === selectedOrder.order_id ? { ...o, status: 'Diproses' } : o
       ));

       setShowDeliveryForm(false); // Hide the form
       setSelectedOrder(null); // Clear selected order
       fetchOrders(); // Refresh the order list
     } catch (error) {
        console.error('Error creating delivery:', error);
        // TODO: Show error message to user
        // Keep form open to allow correction, or close depending on desired UX
        // setShowDeliveryForm(false);
     } finally {
        setCreatingDelivery(false);
     }
  };

   // Function to cancel/close the delivery form
   const handleCancelDeliveryForm = () => {
       setShowDeliveryForm(false);
       setSelectedOrder(null);
   };

   // Function to handle status update submission
   const handleStatusUpdateSubmit = async () => {
       if (!orderToUpdateStatus || !newStatus) return; // Basic validation

       setCreatingDelivery(true); // Reuse loading state, maybe rename later
       try {
           const token = localStorage.getItem('token');
           const config = {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           };
           // Send PATCH request to update order status
           await API.patch(`/orders/${orderToUpdateStatus.order_id}/status`, { status: newStatus }, config);
           console.log('Order status updated successfully!');
           // TODO: Show success message

           // Update the specific order in the local state
           setOrders(orders.map(o => 
               o.order_id === orderToUpdateStatus.order_id ? { ...o, status: newStatus } : o
           ));

           setShowStatusUpdateModal(false);
           setOrderToUpdateStatus(null);
           setNewStatus('');
       } catch (error) {
           console.error('Error updating order status:', error);
           // TODO: Show error message
       } finally {
           setCreatingDelivery(false);
       }
   };

   // Function to cancel status update modal
   const handleCancelStatusUpdate = () => {
       setShowStatusUpdateModal(false);
       setOrderToUpdateStatus(null);
       setNewStatus('');
   };

  useEffect(() => {
    fetchOrders();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        {/* <OrderForm onSubmit={handleSubmit} /> */} {/* Hide the order creation form for now */}
        {/* Pass the new handler to OrderList */}
        <OrderList orders={orders} onCreateDeliveryClick={handleCreateDeliveryClick} onUpdateStatusClick={handleUpdateStatusClick} />

        {/* Conditionally render the DeliveryForm */}
        {showDeliveryForm && selectedOrder && (
            <DeliveryForm
              order={selectedOrder}
              onSubmit={handleDeliveryFormSubmit}
              onCancel={handleCancelDeliveryForm}
            />
        )}

        {/* Status Update Modal (conditional rendering) */}
        {showStatusUpdateModal && orderToUpdateStatus && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                    <h3 className="text-lg font-bold mb-4">Update Status Order #{orderToUpdateStatus.order_id}</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newStatus">Status Baru</label>
                        {/* TODO: Use a dropdown with predefined statuses */}
                        <select
                            id="newStatus"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                             <option value="">Pilih Status</option>
                             {/* Tambahkan opsi status lain di sini */}
                             <option value="Diproses">Diproses</option>
                             <option value="Dikirim">Dikirim</option>
                             <option value="Selesai">Selesai</option>
                             <option value="Dibatalkan">Dibatalkan</option>
                             <option value="Dikembalikan">Dikembalikan</option>
                             {/* Anda bisa menambahkan status lain sesuai kebutuhan */}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleStatusUpdateSubmit}
                            disabled={creatingDelivery}
                        >
                            {creatingDelivery ? 'Menyimpan...' : 'Update Status'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelStatusUpdate}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            disabled={creatingDelivery}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </>
  );
};

export default Orders;
