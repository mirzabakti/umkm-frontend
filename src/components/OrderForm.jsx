import { useState } from "react";

const OrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    items: [{ product_id: "", quantity: "", price: "" }],
  });
  // State untuk validasi
  const [validationErrors, setValidationErrors] = useState({
    customer_id: '',
    items: [], // Array untuk error per item
  });

  const handleItemChange = (index, e) => {
    const items = [...formData.items];
    items[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items });

    // Clear validation error untuk field yang sedang diubah
    const itemErrors = [...validationErrors.items];
    if (itemErrors[index]) { // Cek jika error untuk item ini ada
        itemErrors[index][e.target.name] = ''; // Kosongkan error spesifik field
        setValidationErrors(prev => ({ ...prev, items: itemErrors }));
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: "", quantity: "", price: "" }],
    });
    // Tambahkan placeholder error untuk item baru
    setValidationErrors(prev => ({ ...prev, items: [...prev.items, {}] }));
  };

  const removeItem = (indexToRemove) => {
      setFormData(prev => ({
          ...prev,
          items: prev.items.filter((_, index) => index !== indexToRemove)
      }));
      // Hapus error untuk item yang dihapus
      setValidationErrors(prev => ({
          ...prev,
          items: prev.items.filter((_, index) => index !== indexToRemove)
      }));
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear validation error untuk field customer_id saat diubah
      setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }));
  }

  const validateForm = () => {
    const errors = {
      customer_id: '',
      items: [],
    };
    let isValid = true;

    // Validasi customer_id
    if (!formData.customer_id || parseInt(formData.customer_id) <= 0 || isNaN(parseInt(formData.customer_id))) {
      errors.customer_id = 'ID Customer tidak valid';
      isValid = false;
    }

    // Validasi items array
    if (!formData.items || formData.items.length === 0) {
        // Menangani jika array items kosong (meski sudah ada 1 item default)
        // Error ini mungkin muncul jika item dihapus semua
        // Kita bisa menampilkan error umum atau membiarkan error per item saja.
        // Contoh: tampilkan error per item jika array tidak kosong tapi isinya invalid
         if (formData.items.length === 0) { // Jika array items kosong setelah dihapus
             // Mungkin tampilkan pesan 'Tambah minimal satu item' di UI utama
             isValid = false; // Form tidak valid jika tidak ada item
         }
    }

    // Validasi setiap item
    formData.items.forEach((item, index) => {
      const itemErrors = {};
      if (!item.product_id || parseInt(item.product_id) <= 0 || isNaN(parseInt(item.product_id))) {
        itemErrors.product_id = 'ID Produk tidak valid';
        isValid = false;
      }
      if (!item.quantity || parseInt(item.quantity) <= 0 || isNaN(parseInt(item.quantity))) {
        itemErrors.quantity = 'Kuantitas harus positif';
        isValid = false;
      }
      if (!item.price || parseFloat(item.price) <= 0 || isNaN(parseFloat(item.price))) {
        itemErrors.price = 'Harga harus positif';
        isValid = false;
      }
      errors.items[index] = itemErrors; // Simpan error per item di index yang sesuai
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({ customer_id: '', items: formData.items.map(() => ({})) }); // Clear previous validation errors

    if (!validateForm()) {
      return; // Hentikan jika validasi gagal
    }

    // Siapkan data untuk disubmit (konversi string ke number)
    const dataToSubmit = {
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
        })),
    };

    onSubmit(dataToSubmit);
    setFormData({ customer_id: "", items: [{ product_id: "", quantity: "", price: "" }] }); // Reset form setelah submit berhasil
    setValidationErrors({ customer_id: '', items: [{}] }); // Reset validation errors juga
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Tambah Order Baru</h3>
      
      <div>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer ID:</label>
        <input
          id="customer_id"
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleChange}
          className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.customer_id ? 'border-red-500' : 'border-gray-300'}`}
          type="number" // Gunakan type number untuk validasi browser bawaan juga
          min="1"
        />
        {validationErrors.customer_id && <p className="mt-1 text-sm text-red-600">{validationErrors.customer_id}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Items:</label>
        {formData.items.map((item, idx) => (
          <div key={idx} className="border p-4 rounded-md space-y-2 relative bg-white">
            {/* Tombol hapus item, tampilkan jika item > 1 */}
            {formData.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                aria-label="Hapus item"
              >
                X
              </button>
            )}

            <div>
              <label htmlFor={`product_id-${idx}`} className="block text-sm font-medium text-gray-700">Product ID:</label>
              <input
                id={`product_id-${idx}`}
                name="product_id"
                placeholder="Product ID"
                value={item.product_id}
                onChange={(e) => handleItemChange(idx, e)}
                 className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.items[idx]?.product_id ? 'border-red-500' : 'border-gray-300'}`}
                 type="number"
                 min="1"
              />
              {validationErrors.items[idx]?.product_id && <p className="mt-1 text-sm text-red-600">{validationErrors.items[idx].product_id}</p>}
            </div>

            <div>
               <label htmlFor={`quantity-${idx}`} className="block text-sm font-medium text-gray-700">Quantity:</label>
              <input
                id={`quantity-${idx}`}
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, e)}
                className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.items[idx]?.quantity ? 'border-red-500' : 'border-gray-300'}`}
                type="number"
                min="1"
              />
              {validationErrors.items[idx]?.quantity && <p className="mt-1 text-sm text-red-600">{validationErrors.items[idx].quantity}</p>}
            </div>

            <div>
               <label htmlFor={`price-${idx}`} className="block text-sm font-medium text-gray-700">Price:</label>
              <input
                id={`price-${idx}`}
                name="price"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(idx, e)}
                className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${validationErrors.items[idx]?.price ? 'border-red-500' : 'border-gray-300'}`}
                type="number"
                min="0.01"
                step="0.01"
              />
              {validationErrors.items[idx]?.price && <p className="mt-1 text-sm text-red-600">{validationErrors.items[idx].price}</p>}
            </div>

          </div>
        ))}
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full" type="button" onClick={addItem}>
        + Tambah Item
      </button>
      
      {/* Tambahkan pesan error umum jika tidak ada item */}
       {!formData.items || formData.items.length === 0 && validationErrors.items.length === 0 && (
           <p className="mt-2 text-sm text-red-600 text-center">Order minimal harus memiliki satu item.</p>
       )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" type="submit">
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;
