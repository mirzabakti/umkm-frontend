import { useEffect, useState } from 'react';
import API from '../services/api';
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';
import Navbar from '../components/Navbar';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchCustomers = async () => {
    const res = await API.get('/customers');
    setCustomers(res.data);
  };

  const handleCreateOrUpdate = async (data) => {
    if (editing) {
      await API.put(`/customers/${editing.customer_id}`, data);
      setEditing(null);
    } else {
      await API.post('/customers', data);
    }
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await API.delete(`/customers/${id}`);
    fetchCustomers();
  };

  const handleEdit = (customer) => setEditing(customer);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
        <CustomerForm onSubmit={handleCreateOrUpdate} editingCustomer={editing} />
        <CustomerList customers={customers} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </>
  );
};

export default Customers;
