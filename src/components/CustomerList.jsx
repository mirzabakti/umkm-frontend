const CustomerList = ({ customers, onEdit, onDelete }) => {
  return (
    <ul>
      {customers.map((c) => (
        <li key={c.customer_id}>
          {c.customer_name} - {c.email}
          <button onClick={() => onEdit(c)}>Edit</button>
          <button onClick={() => onDelete(c.customer_id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default CustomerList;
