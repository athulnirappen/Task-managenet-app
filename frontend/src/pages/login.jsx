import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.data));
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.msg || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border rounded-xl px-8 py-9">
        <h1 className="text-2xl font-semibold text-black mb-1.5">Login</h1>

        
        {apiError && (
          <div className="bg-[#e5637a]/10 border border-[#e5637a]/35 text-[#e5637a] text-sm px-3.5 py-2.5 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[#9a9da8] uppercase tracking-wide mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-black text-sm focus:outline-none transition-colors ${
                fieldErrors.email ? "border-[#e5637a]" : "border-[#2c2f3a] focus:border-[#5b8def]"
              }`}
            />
            
            {fieldErrors.email && (
              <p className="text-[#e5637a] text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#9a9da8] uppercase tracking-wide mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-black text-sm focus:outline-none transition-colors ${
                fieldErrors.password ? "border-[#e5637a]" : "border-[#2c2f3a] focus:border-[#5b8def]"
              }`}
            />
            
            {fieldErrors.password && (
              <p className="text-[#e5637a] text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-lg bg-[#5b8def] hover:bg-[#4a7cdb] disabled:opacity-60 disabled:cursor-not-allowed text-[#0e0f13] text-sm font-semibold transition-colors"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-5 text-sm text-[#9a9da8] text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#5b8def] hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;