"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setToken } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/features/auth/authApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken(res.access_token));
      router.push('/products');
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const apiError = err as { data?: { message?: string } };
        alert(apiError.data?.message || 'Login failed');
      } else {
        alert('Login failed');
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>Don't have a account?  <a href='/signup' className='text-red-500'>Signup</a></p>
      
      </form>
      
    </div>
  );
}
