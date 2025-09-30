'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert("Check your email for confirmation!");
  };

  return (
    <div className="p-6">
      <h1>Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 block mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 block mb-2"
      />
      <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2">
        Sign Up
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
