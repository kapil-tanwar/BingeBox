import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const emailValue = searchParams.get("email");
  const [email, setEmail] = useState(emailValue || "");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ email, username, password });
  };

  return (
    <AuthLayout
      eyebrow="Join BingeBox"
      title={<>Create your <em className="text-champagne">account</em></>}
      subtitle="A username, an email and a password. That's the whole ceremony."
      footer={
        <>
          Already a member?{" "}
          <Link to="/login" className="link-rule text-ivory">Sign in</Link>
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
          <label htmlFor="username" className="label">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="username"
            required
            className="field"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="field"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSigningUp} className="btn-primary w-full">
          {isSigningUp ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
