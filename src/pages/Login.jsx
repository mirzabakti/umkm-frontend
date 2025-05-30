import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email tidak boleh kosong';
    } else if (!/^[\S+@\\S+\\.\\S+]+$/.test(email.trim())) {
      errors.email = 'Format email tidak valid';
    }
    if (!password) {
      errors.password = 'Password tidak boleh kosong';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Redirect ke dashboard sesuai role
      if (res.data.user.role === 'admin' || res.data.user.role === 'owner') {
        navigate('/products');
      } else {
        navigate('/catalog'); // Customer ke katalog
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full mb-1 px-3 py-2 border rounded ${validationErrors.email ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.email && <div className="mb-4 text-red-500 text-sm">{validationErrors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full mb-1 px-3 py-2 border rounded ${validationErrors.password ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.password && <div className="mb-6 text-red-500 text-sm">{validationErrors.password}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login; 