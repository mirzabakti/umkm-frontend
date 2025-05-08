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
    <form onSubmit={handleSubmit}>
      <input name="product_name" placeholder="Name" value={formData.product_name} onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
      <input name="category_id" placeholder="Category ID" value={formData.category_id} onChange={handleChange} />
      <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
    </form>
  );
};

export default ProductForm;
