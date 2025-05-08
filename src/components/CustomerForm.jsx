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
    <form onSubmit={handleSubmit}>
      <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Name" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">{editingCustomer ? 'Update' : 'Add'} Customer</button>
    </form>
  );
};

export default CustomerForm;
