import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Nama tidak boleh kosong';
    if (!email.trim()) {
      errors.email = 'Email tidak boleh kosong';
    } else if (!/^[\S+@\S+\.\S+]+$/.test(email.trim())) {
      errors.email = 'Format email tidak valid';
    }
    if (!password) {
      errors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await API.post('/auth/register', { name, email, password });
      setSuccess('Register berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Register gagal');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full mb-1 px-3 py-2 border rounded ${validationErrors.name ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.name && <div className="mb-4 text-red-500 text-sm">{validationErrors.name}</div>}
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
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
          <div className="mt-4 text-sm text-center">
            Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register; 