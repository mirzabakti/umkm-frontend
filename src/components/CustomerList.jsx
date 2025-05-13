const CustomerList = ({ customers, onEdit, onDelete }) => {
  return (
    <ul className="space-y-2">
      {customers.map((c) => (
        <li key={c.customer_id} className="p-3 bg-white rounded shadow flex justify-between items-center">
          <div>
            <p className="font-bold">{c.customer_name}</p>
            <p className="text-sm text-gray-600">
              {c.email} - {c.phone_number}
            </p>
            <p className="text-sm text-gray-500">{c.address}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => onEdit(c)} className="bg-yellow-400 px-2 py-1 text-sm rounded">
              Edit
            </button>
            <button onClick={() => onDelete(c.customer_id)} className="bg-red-500 text-white px-2 py-1 text-sm rounded">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CustomerList;
