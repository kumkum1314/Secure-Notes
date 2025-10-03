import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-16 px-4">
      <div className="glass card p-6 sm:p-8 elevate">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome back</h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="field"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="field"
              required
            />
          </div>
          <button className="btn btn-primary w-full">Login</button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Don't have an account?{" "}
          <Link className="text-indigo-400 hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
