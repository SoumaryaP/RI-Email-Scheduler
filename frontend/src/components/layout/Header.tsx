"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type User = {
  name: string;
  email: string;
  picture?: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {}
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-sm border-b border-[var(--color-brand-line)] px-6 py-4">
      <h1 className="text-2xl font-bold text-[var(--color-brand-ink)]">
        ReachInbox
      </h1>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img src={user.picture} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[var(--color-brand-line)]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-navy)] flex items-center justify-center text-white font-bold uppercase">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 leading-tight">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[var(--color-brand-navy)] flex items-center justify-center text-white font-bold">
               S
             </div>
             <span className="font-medium">Soumarya</span>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}