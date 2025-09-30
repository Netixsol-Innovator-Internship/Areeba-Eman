'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupMutation } from '../../store/apiSlice';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signup] = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup({ email, password }).unwrap();
      localStorage.setItem('token', res.token);
      router.push('/chat');
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
        <h2 className="text-xl mb-4">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full border p-2 rounded"
        />
        <button className="bg-green-500 text-white p-2 rounded w-full">
          Sign Up
        </button>
      </form>
    </div>
  );
}
