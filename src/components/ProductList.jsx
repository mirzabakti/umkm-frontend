const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <ul className="space-y-2">
      {products.map((p) => (
        <li key={p.product_id} className="p-3 bg-white rounded shadow flex justify-between items-center">
          <div>
            <p className="font-bold">{p.product_name}</p>
            <p className="text-sm text-gray-600">- Rp{p.price}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => onEdit(p)} className="bg-yellow-400 px-2 py-1 text-sm rounded">
              Edit
            </button>
            <button onClick={() => onDelete(p.product_id)} className="bg-red-500 text-white px-2 py-1 text-sm rounded">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
