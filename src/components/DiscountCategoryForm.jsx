import { useState, useEffect } from 'react';

const DiscountCategoryForm = ({ onSubmit, editingCategory }) => {
  const [formData, setFormData] = useState({
    discount_category_name: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
    } else {
      setFormData({ discount_category_name: '' });
    }
    setValidationErrors({});
  }, [editingCategory]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.discount_category_name.trim()) errors.discount_category_name = 'Nama kategori diskon tidak boleh kosong';
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
    if (!editingCategory) { // Clear form after add, but not after starting edit
        setFormData({ discount_category_name: '' });
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input
        name="discount_category_name"
        value={formData.discount_category_name}
        onChange={handleChange}
        placeholder="Nama Kategori Diskon"
        className={`w-full p-2 border rounded ${validationErrors.discount_category_name ? 'border-red-500' : ''}`}
      />
      {validationErrors.discount_category_name && <div className="text-red-500 text-sm mt-1">{validationErrors.discount_category_name}</div>}

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        {editingCategory ? 'Update' : 'Tambah'} Kategori Diskon
      </button>
    </form>
  );
};

export default DiscountCategoryForm; 