const OrderList = ({ orders }) => (
  <ul>
    {orders.map((o) => (
      <li key={o.order_id}>
        Order #{o.order_id} - {o.customer_name} on {new Date(o.order_date).toLocaleDateString()}
      </li>
    ))}
  </ul>
);

export default OrderList;
