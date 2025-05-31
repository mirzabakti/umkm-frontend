import { useState } from 'react';

const ProductReviewForm = ({ onSubmit, product_id }) => {
  const [formData, setFormData] = useState({
    rating: '',
    comment: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Get customer_id from localStorage (assuming it's stored with user info)
  const user = JSON.parse(localStorage.getItem('user'));
  const customer_id = user?.customer_id; // Use optional chaining in case user is null


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.rating || parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) {
      errors.rating = 'Rating harus antara 1 dan 5';
    }
    if (!formData.comment.trim()) {
      errors.comment = 'Komentar tidak boleh kosong';
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

    if (!customer_id) {
        console.error('Customer ID not found. User might not be logged in or is not a customer.');
        // TODO: Show an error message to the user
        return;
    }

    // Include product_id and customer_id in the data
    const dataToSubmit = {
        ...formData,
        product_id: parseInt(product_id), // product_id is passed as a prop
        customer_id: customer_id,
        rating: parseInt(formData.rating),
    };

    onSubmit(dataToSubmit);
    // Clear form after submission
    setFormData({
      rating: '',
      comment: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">Tinggalkan Ulasan</h3>

       {/* Rating Input */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5):</label>
        <input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.rating ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Rating 1-5"
        />
         {validationErrors.rating && <div className="text-red-500 text-sm mt-1">{validationErrors.rating}</div>}
      </div>

      {/* Comment Textarea */}
      <div>
         <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Komentar:</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.comment ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Tulis komentar Anda di sini"
          rows="4"
        ></textarea>
        {validationErrors.comment && <div className="text-red-500 text-sm mt-1">{validationErrors.comment}</div>}
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        Kirim Ulasan
      </button>
    </form>
  );
};

export default ProductReviewForm; 