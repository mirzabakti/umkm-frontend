import { useState } from "react";

const OrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    items: [{ product_id: "", quantity: "", price: "" }],
  });

  const handleItemChange = (index, e) => {
    const items = [...formData.items];
    items[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: "", quantity: "", price: "" }],
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ customer_id: "", items: [{ product_id: "", quantity: "", price: "" }] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
      <input name="customer_id" placeholder="Customer ID" value={formData.customer_id} onChange={handleChange} className="w-full p-2 border rounded" />
      {formData.items.map((item, idx) => (
        <div key={idx} className="space-y-2">
          <input name="product_id" placeholder="Product ID" value={item.product_id} onChange={(e) => handleItemChange(idx, e)} className="w-full p-2 border rounded" />
          <input name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(idx, e)} className="w-full p-2 border rounded" />
          <input name="price" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(idx, e)} className="w-full p-2 border rounded" />
        </div>
      ))}
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="button" onClick={addItem}>
        + Item
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;
