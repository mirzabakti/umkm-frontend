import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/products" element={<Products />} /> 
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
