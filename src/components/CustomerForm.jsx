import { useState, useEffect } from 'react';

const CustomerForm = ({ onSubmit, editingCustomer }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    phone_number: '',
    email: '',
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ customer_name: '', address: '', phone_number: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
      <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">{editingCustomer ? 'Update' : 'Add'} Customer</button>
    </form>
  );
};

export default CustomerForm;
