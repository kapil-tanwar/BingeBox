import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuthStore } from "../store/authUser";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ email, password });
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title={<>Sign <em className="text-champagne">in</em></>}
      subtitle="Log in for your watchlist and a personalised programme."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="link-rule text-ivory">Create an account</Link>
        </>
      }
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            required
            className="field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            required
            className="field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoggingIn} className="btn-primary w-full">
          {isLoggingIn ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
