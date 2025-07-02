import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "User" });
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (formData.role === "Admin" && secretKey !== "kaushikahir") {
      setError("Invalid Admin Secret Key");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) navigate("/verify");
      else setError(result.message || "Signup failed");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] px-4">
      <form onSubmit={handleSubmit} className="bg-[#2B2B2B] p-8 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#D4D4D4] p-3 rounded-full mb-3">
            <UserPlus size={24} className="text-[#2B2B2B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Create Account</h2>
        </div>

        <div className="flex justify-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="User" 
              checked={formData.role === "User"} 
              onChange={handleChange} 
              className="accent-[#D4D4D4]"
            />
            <span className="text-[#B3B3B3]">User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="Admin" 
              checked={formData.role === "Admin"} 
              onChange={handleChange} 
              className="accent-[#D4D4D4]"
            />
            <span className="text-[#B3B3B3]">Admin</span>
          </label>
        </div>

        {formData.role === "Admin" && (
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Secret Key" 
              value={secretKey} 
              onChange={(e) => setSecretKey(e.target.value)} 
              className="w-full px-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4]"
            />
          </div>
        )}

        <div className="space-y-4">
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Full Name" 
            className="w-full px-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="w-full px-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
          />
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className="w-full px-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border border-[#B3B3B3] focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center py-2">{error}</p>}

        <button 
          type="submit" 
          className="w-full bg-[#D4D4D4] text-[#2B2B2B] font-medium py-2 rounded-md hover:bg-[#B3B3B3] transition-colors duration-200"
        >
          Sign Up
        </button>

        <p className="text-center text-[#B3B3B3] text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#D4D4D4] font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;