'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../store/apiSlice';
import { useAppDispatch } from '@/store/hooks';
import { setToken } from "@/features/authSlice";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const res = await login({ email, password }).unwrap();
    console.log("user logged in::", res);

    const token = res.access_token; // ✅ correct property

    dispatch(setToken(token)); // Redux
    localStorage.setItem("token", token); // localStorage

    router.push("/chat");
  } catch {
    alert("Login failed");
  } }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
        <h2 className="text-xl mb-4">Login</h2>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 w-full border p-2 rounded" />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full border p-2 rounded" />
        <button className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}
