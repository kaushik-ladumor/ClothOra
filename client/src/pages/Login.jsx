import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        navigate(result.role === "Admin" ? "/admin-dashboard" : "/");
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] px-4">
      <div className="w-full max-w-md bg-[#2B2B2B] p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#D4D4D4] p-3 rounded-full mb-3">
            <Lock size={24} className="text-[#2B2B2B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-[#B3B3B3]" size={18} />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-[#B3B3B3]" size={18} />
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
            />
            {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#D4D4D4] text-[#2B2B2B] font-medium py-2 rounded-md hover:bg-[#B3B3B3] transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#B3B3B3]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#D4D4D4] font-medium hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;