import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    phone_number: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Ambil data customer berdasarkan user yang login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'customer') {
          setError('Anda harus login sebagai customer.');
          setLoading(false);
          return;
        }
        // Ambil customer_id dari user_id
        const resCustomer = await API.get(`/customers/user/${user.id}`);
        setFormData(resCustomer.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat profil');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await API.put(`/customers/${formData.customer_id}`, formData);
      setSuccess('Profil berhasil diupdate!');
    } catch (err) {
      setError('Gagal update profil');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center p-4">Loading...</div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="text-center text-red-500 p-4">{error}</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>
        <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
          <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Nama" className="w-full p-2 border rounded" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Alamat" className="w-full p-2 border rounded" />
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="No HP" className="w-full p-2 border rounded" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" disabled />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
            Update Profil
          </button>
          {success && <div className="text-green-600 text-center">{success}</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </>
  );
};

export default Profile; 