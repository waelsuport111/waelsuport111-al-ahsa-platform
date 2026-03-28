"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === "ahsa123") {
      localStorage.setItem("auth", "true");
      router.push("/cms-secure-ahsa-8392");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-white"
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full rounded-lg bg-white px-4 py-3 text-black font-medium hover:opacity-90 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}