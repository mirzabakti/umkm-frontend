import { useState, useEffect } from 'react';
import axios from 'axios';

const DiscountForm = ({ onSubmit, editingDiscount }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    discount_category_id: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const API_URL = 'http://localhost:5000'; // Base URL for API calls

  useEffect(() => {
    // Fetch products and categories when the component mounts
    const fetchOptions = async () => {
        try {
            setLoadingOptions(true);
            const productsRes = await axios.get(`${API_URL}/products`);
            const categoriesRes = await axios.get(`${API_URL}/discount-categories`);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching form options:', error);
        } finally {
            setLoadingOptions(false);
        }
    };
    fetchOptions();

  }, []);


  useEffect(() => {
    if (editingDiscount) {
      // Format dates for input[type="date"] (YYYY-MM-DD)
      const formattedStartDate = editingDiscount.start_date ? new Date(editingDiscount.start_date).toISOString().split('T')[0] : '';
      const formattedEndDate = editingDiscount.end_date ? new Date(editingDiscount.end_date).toISOString().split('T')[0] : '';

      setFormData({
        product_id: editingDiscount.product_id || '',
        discount_category_id: editingDiscount.discount_category_id || '',
        discount_percentage: editingDiscount.discount_percentage || '',
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
    } else {
      setFormData({
        product_id: '',
        discount_category_id: '',
        discount_percentage: '',
        start_date: '',
        end_date: '',
      });
    }
    setValidationErrors({});
  }, [editingDiscount]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    const { product_id, discount_category_id, discount_percentage, start_date, end_date } = formData;

    if (!discount_percentage || parseFloat(discount_percentage) <= 0 || parseFloat(discount_percentage) > 100) {
        errors.discount_percentage = 'Persentase diskon harus antara 0-100';
    }

    if (!start_date) {
        errors.start_date = 'Tanggal mulai tidak boleh kosong';
    }

     if (!end_date) {
        errors.end_date = 'Tanggal berakhir tidak boleh kosong';
    }
    // Optional: Add logic to check if end_date is after start_date

    // Either product_id or discount_category_id must be selected, but not both
    if ((!product_id && !discount_category_id) || (product_id && discount_category_id)) {
        errors.general = 'Pilih salah satu: Produk atau Kategori Diskon';
        if (product_id && discount_category_id) {
             errors.product_id = 'Pilih salah satu saja';
             errors.discount_category_id = 'Pilih salah satu saja';
        } else if (!product_id && !discount_category_id) {
             errors.product_id = 'Pilih salah satu';
             errors.discount_category_id = 'Pilih salah satu';
        }
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

    // Prepare data for submission, converting empty strings for IDs to null
    const dataToSubmit = {
        ...formData,
        product_id: formData.product_id === '' ? null : parseInt(formData.product_id),
        discount_category_id: formData.discount_category_id === '' ? null : parseInt(formData.discount_category_id),
        discount_percentage: parseFloat(formData.discount_percentage),
    };

    onSubmit(dataToSubmit);
    if (!editingDiscount) { // Clear form after add, but not after starting edit
        setFormData({
            product_id: '',
            discount_category_id: '',
            discount_percentage: '',
            start_date: '',
            end_date: '',
        });
    }
  };

   if (loadingOptions) {
    return <div className="bg-gray-100 p-4 rounded">Loading options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">{editingDiscount ? 'Edit' : 'Tambah'} Diskon</h3>
      
      {validationErrors.general && <div className="text-red-500 text-sm mt-1">{validationErrors.general}</div>}

      {/* Select Product */}
      <div>
        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Produk:</label>
        <select
          id="product_id"
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
           className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.product_id ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">-- Pilih Produk (Opsional) --</option>
          {products.map(product => (
            <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
          ))}
        </select>
        {validationErrors.product_id && <div className="text-red-500 text-sm mt-1">{validationErrors.product_id}</div>}
      </div>

      {/* Select Discount Category */}
      <div>
        <label htmlFor="discount_category_id" className="block text-sm font-medium text-gray-700">Kategori Diskon:</label>
        <select
          id="discount_category_id"
          name="discount_category_id"
          value={formData.discount_category_id}
          onChange={handleChange}
           className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.discount_category_id ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">-- Pilih Kategori (Opsional) --</option>
          {categories.map(category => (
            <option key={category.discount_category_id} value={category.discount_category_id}>{category.discount_category_name}</option>
          ))}
        </select>
        {validationErrors.discount_category_id && <div className="text-red-500 text-sm mt-1">{validationErrors.discount_category_id}</div>}
      </div>

      {/* Discount Percentage */}
      <div>
         <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">Persentase Diskon (%):</label>
        <input
          id="discount_percentage"
          name="discount_percentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={formData.discount_percentage}
          onChange={handleChange}
           className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.discount_percentage ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Persentase Diskon"
        />
        {validationErrors.discount_percentage && <div className="text-red-500 text-sm mt-1">{validationErrors.discount_percentage}</div>}
      </div>

       {/* Start Date */}
      <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Tanggal Mulai:</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.start_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {validationErrors.start_date && <div className="text-red-500 text-sm mt-1">{validationErrors.start_date}</div>}
      </div>

      {/* End Date */}
      <div>
           <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Tanggal Berakhir:</label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.end_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {validationErrors.end_date && <div className="text-red-500 text-sm mt-1">{validationErrors.end_date}</div>}
      </div>


      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        {editingDiscount ? 'Update' : 'Tambah'} Diskon
      </button>
    </form>
  );
};

export default DiscountForm; 