import { useEffect, useState } from 'react';
import API from '../services/api';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await API.get('/orders');
    setOrders(res.data);
  };

  const handleSubmit = async (data) => {
    await API.post('/orders', data);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <OrderForm onSubmit={handleSubmit} />
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;
