import { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, editingProduct }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    stock: '',
    category_id: ''
  });

  useEffect(() => {
    if (editingProduct) setFormData(editingProduct);
  }, [editingProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ product_name: '', price: '', stock: '', category_id: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input name="product_name" placeholder="Name" value={formData.product_name} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="category_id" placeholder="Category ID" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
    </form>
  );
};

export default ProductForm;
