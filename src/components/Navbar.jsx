import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-700">
          <Link to="/">UMKM Shop</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/catalog" className="hover:underline">Katalog</Link>
          {user && user.role === 'customer' && (
            <>
              <Link to="/cart" className="hover:underline">Keranjang</Link>
              <Link to="/wishlist" className="hover:underline">Wishlist</Link>
              <Link to="/orders/history" className="hover:underline">Riwayat Order</Link>
              <Link to="/profile" className="hover:underline">Profil</Link>
            </>
          )}
          {user && (user.role === 'admin' || user.role === 'owner') && (
            <>
              <Link to="/products" className="hover:underline">Produk</Link>
              <Link to="/orders" className="hover:underline">Order</Link>
              <Link to="/discount-categories" className="hover:underline">Kategori Diskon</Link>
              <Link to="/discounts" className="hover:underline">Diskon</Link>
              <Link to="/" className="hover:underline">Customer</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="ml-2 text-red-600 hover:underline">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 