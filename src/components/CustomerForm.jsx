import { useState, useEffect } from 'react';

const CustomerForm = ({ onSubmit, editingCustomer }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    phone_number: '',
    email: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({ customer_name: '', address: '', phone_number: '', email: '' });
    }
    setValidationErrors({});
  }, [editingCustomer]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customer_name.trim()) errors.customer_name = 'Nama customer tidak boleh kosong';
    if (!formData.address.trim()) errors.address = 'Alamat tidak boleh kosong';
    if (!formData.phone_number.trim()) errors.phone_number = 'Nomor telepon tidak boleh kosong';
    if (!formData.email.trim()) {
      errors.email = 'Email tidak boleh kosong';
    } else if (!/^[\S+@\S+\.\S+]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Name" className={`w-full p-2 border rounded ${validationErrors.customer_name ? 'border-red-500' : ''}`} />
      {validationErrors.customer_name && <div className="text-red-500 text-sm mt-1">{validationErrors.customer_name}</div>}

      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`w-full p-2 border rounded ${validationErrors.address ? 'border-red-500' : ''}`} />
      {validationErrors.address && <div className="text-red-500 text-sm mt-1">{validationErrors.address}</div>}

      <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" className={`w-full p-2 border rounded ${validationErrors.phone_number ? 'border-red-500' : ''}`} />
      {validationErrors.phone_number && <div className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</div>}

      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`w-full p-2 border rounded ${validationErrors.email ? 'border-red-500' : ''}`} />
      {validationErrors.email && <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>}

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">{editingCustomer ? 'Update' : 'Add'} Customer</button>
    </form>
  );
};

export default CustomerForm;
