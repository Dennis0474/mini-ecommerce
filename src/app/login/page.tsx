"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
   
  const result = await signIn("credentials", {
    username: username,
    password: password,
    redirect: false
    });

    if (result?.error) {
    setError("Invalid Username or Password")
    } else {
    router.push("/dashboard")
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Log in</button>
    </form>
  );
}
