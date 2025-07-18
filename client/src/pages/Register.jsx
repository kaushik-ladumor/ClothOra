import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });
  const [secretKey, setSecretKey] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    const ADMIN_SECRET_KEY = import.meta.env.VITE_RAZORPAY_KEY;

    if (formData.role === "Admin" && !secretKey) {
      newErrors.secretKey = "Secret key is required for admin";
    } else if (formData.role === "Admin" && secretKey !== ADMIN_SECRET_KEY) {
      newErrors.secretKey = "Invalid admin secret key";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Account created successfully!", { id: loadingToast });
      navigate("/verify", { state: { email: formData.email, role: formData.role } });
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: loadingToast });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
          },
          loading: {
            duration: Infinity,
          }
        }}
      />

      <form onSubmit={handleSubmit} className="bg-[#2B2B2B] p-8 rounded-xl w-full max-w-md space-y-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="bg-[#D4D4D4] p-3 rounded-full mb-3 shadow-md">
            <UserPlus size={28} className="text-[#2B2B2B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Create Account</h2>
          <p className="text-[#B3B3B3] text-sm mt-1">
            Join us to get started
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="User"
              checked={formData.role === "User"}
              onChange={handleChange}
              className="h-4 w-4 accent-[#D4D4D4]"
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
              className="h-4 w-4 accent-[#D4D4D4]"
            />
            <span className="text-[#B3B3B3]">Admin</span>
          </label>
        </div>

        {/* Admin Secret Key */}
        {formData.role === "Admin" && (
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#B3B3B3]" />
              </div>
              <input
                type="password"
                placeholder="Enter Admin Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] text-[#D4D4D4] rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
              />
            </div>
            {errors.secretKey && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.secretKey}
              </p>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#B3B3B3]" />
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] text-[#D4D4D4] rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#B3B3B3]" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] text-[#D4D4D4] rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#B3B3B3]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#1F1F1F] text-[#D4D4D4] rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-[#B3B3B3] hover:text-[#D4D4D4]" />
                ) : (
                  <Eye className="h-5 w-5 text-[#B3B3B3] hover:text-[#D4D4D4]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#D4D4D4] text-[#2B2B2B] font-medium py-2.5 rounded-lg hover:bg-[#B3B3B3] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Sign Up
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-[#B3B3B3] text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#D4D4D4] font-medium hover:underline hover:text-[#FFFFFF]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;