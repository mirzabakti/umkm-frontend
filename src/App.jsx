import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Payment from './pages/Payment';

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/payment/:order_id" element={<Payment />} />
        <Route path="/products" element={<RequireAdmin><Products /></RequireAdmin>} />
        <Route path="/orders" element={<RequireAdmin><Orders /></RequireAdmin>} />
        <Route path="/" element={<RequireAdmin><Customers /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
