"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupMutation } from '@/features/auth/authApi';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup({ email, password, name }).unwrap();
      alert('Signup successful! Please login.');
      router.push('/login');
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const apiError = err as { data?: { message?: string } };
        alert(apiError.data?.message || 'Signup failed');
      } else {
        alert('Signup failed');
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded mb-4"
          required
        />
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
          className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p>Already have a account?  <a href='/login' className='text-green-500'>Login</a></p>
      </form>
    </div>
  );
}
