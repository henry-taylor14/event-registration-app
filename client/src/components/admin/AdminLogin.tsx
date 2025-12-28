// client/src/components/admin/AdminLogin.tsx

import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getIdTokenResult,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/admin/home';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user, true); // force refresh
        if (tokenResult.claims.admin) {
          navigate('/admin/home');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await result.user.getIdToken(true); // force refresh
      const tokenResult = await getIdTokenResult(result.user);

      if (tokenResult.claims.admin) {
        navigate(redirectPath);
      } else {
        setError('You do not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await result.user.getIdToken(true);
      const tokenResult = await getIdTokenResult(result.user);

      if (tokenResult.claims.admin) {
        navigate(redirectPath);
      } else {
        setError('You do not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-sm text-blue-500 mt-1"
          >
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Sign in with Email
        </button>
      </form>

      <hr className="my-4" />

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default AdminLogin;
