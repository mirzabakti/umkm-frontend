const OrderList = ({ orders }) => (
  <ul className="space-y-2">
    {orders.map((o) => (
      <li key={o.order_id} className="p-3 bg-white rounded shadow flex justify-between items-center">
        <div>
          <p className="font-bold">Order #{o.order_id} - {o.customer_name}</p> 
          <p className="text-sm text-gray-600">on {new Date(o.order_date).toLocaleDateString()}</p>
        </div>
      </li>
    ))}
  </ul>
);

export default OrderList;
