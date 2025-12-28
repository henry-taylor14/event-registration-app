import React, { useState } from 'react';
import { useAuthActions } from '../hooks/useAuthActions';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithEmail, loginWithGoogle, error, loading } = useAuthActions();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await loginWithEmail(email, password);
    if (user) navigate('/admin');
  };

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) navigate('/admin');
  };

  return (
    <div className="login-page">
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>

      <button onClick={handleGoogleLogin} disabled={loading}>
        Sign in with Google
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
