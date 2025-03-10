import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Button from "@/components/UI/Button";

const HARDCODED_USERNAME = process.env.NEXT_PUBLIC_USERNAME || "admin";
const HARDCODED_PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "password123";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      localStorage.setItem("auth", "true");
      router.push("/search");
    } else {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="max-w-sm w-full flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
