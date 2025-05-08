const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.product_id}>
          {p.product_name} - Rp{p.price}
          <button onClick={() => onEdit(p)}>Edit</button>
          <button onClick={() => onDelete(p.product_id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
