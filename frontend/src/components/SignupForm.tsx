import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, clearAuth, setLoading, setError } from '../features/auth/authSlice';
import { setToken, removeToken } from '../utils/token';

const SignupForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.auth.loading);
  const error = useSelector((state: any) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogout = () => {
  removeToken();
  dispatch(clearAuth());
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        dispatch(setAuth({ user: data.user, token: data.token }));
      } else {
        dispatch(setError(data.error || 'Signup failed'));
      }
    } catch (err) {
      dispatch(setError('Network error'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input
        className="text-black w-full border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="text-black w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="w-full bg-green-600 text-white py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;