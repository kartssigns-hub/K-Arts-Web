import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if a NORMAL user is already logged in
    const userToken = localStorage.getItem('token'); // or whatever you named your user token

    if (userToken) {
      // If they are a normal user, kick them back to the main dashboard
      // alert("You are already logged in as a User. Please logout first.");
      navigate('/dashboard'); 
    }
    
    // Check if ADMIN is already logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
       navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual Backend URL
      const response = await fetch('https://k-artz-server.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ⭐ CRITICAL: Saving the special Admin Token
        localStorage.setItem('adminToken', data.token);
        
        // Optional: Save admin info if needed
        localStorage.setItem('adminEmail', data.admin.email);

        // Redirect to the protected dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12122a] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            K'artz <span className="text-yellow-500">Admin</span>
          </h1>
          <p className="text-gray-400 text-sm">Authorized personnel only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="admin@kartz.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
                ← Back to Main Site
            </a>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;