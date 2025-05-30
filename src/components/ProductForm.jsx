import { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, editingProduct }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    stock: '',
    category_id: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({ 
        ...editingProduct,
        price: String(editingProduct.price),
        stock: String(editingProduct.stock),
        category_id: String(editingProduct.category_id),
      });
    } else {
      setFormData({ product_name: '', price: '', stock: '', category_id: '' });
    }
    setValidationErrors({});
  }, [editingProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errors = {};
    if (!formData.product_name.trim()) errors.product_name = 'Nama produk tidak boleh kosong';
    if (!formData.price || parseFloat(formData.price) <= 0 || isNaN(parseFloat(formData.price))) {
      errors.price = 'Harga harus angka positif';
    }
    if (formData.stock === '' || parseInt(formData.stock) < 0 || isNaN(parseInt(formData.stock))) {
      errors.stock = 'Stok harus angka non-negatif';
    }
    if (!formData.category_id || parseInt(formData.category_id) <= 0 || isNaN(parseInt(formData.category_id))) {
      errors.category_id = 'ID kategori tidak valid';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input name="product_name" placeholder="Name" value={formData.product_name} onChange={handleChange} className={`w-full p-2 border rounded ${validationErrors.product_name ? 'border-red-500' : ''}`} />
      {validationErrors.product_name && <div className="text-red-500 text-sm mt-1">{validationErrors.product_name}</div>}

      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className={`w-full p-2 border rounded ${validationErrors.price ? 'border-red-500' : ''}`} />
      {validationErrors.price && <div className="text-red-500 text-sm mt-1">{validationErrors.price}</div>}

      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} className={`w-full p-2 border rounded ${validationErrors.stock ? 'border-red-500' : ''}`} />
      {validationErrors.stock && <div className="text-red-500 text-sm mt-1">{validationErrors.stock}</div>}

      <input name="category_id" type="number" placeholder="Category ID" value={formData.category_id} onChange={handleChange} className={`w-full p-2 border rounded ${validationErrors.category_id ? 'border-red-500' : ''}`} />
      {validationErrors.category_id && <div className="text-red-500 text-sm mt-1">{validationErrors.category_id}</div>}

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
    </form>
  );
};

export default ProductForm;
