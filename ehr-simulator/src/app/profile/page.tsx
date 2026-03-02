'use client';

import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">No user is currently signed in.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border bg-white px-8 py-6 shadow-sm space-y-2">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-slate-700">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>
    </div>
  );
}

