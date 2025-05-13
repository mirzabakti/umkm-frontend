import { useEffect, useState } from 'react';
import API from '../services/api';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get('/products');
    setProducts(res.data);
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await API.put(`/products/${editing.product_id}`, data);
      setEditing(null);
    } else {
      await API.post('/products', data);
    }
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (p) => setEditing(p);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <ProductForm onSubmit={handleSubmit} editingProduct={editing} />
      <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Products;
