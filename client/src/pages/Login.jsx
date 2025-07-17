import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from URL search parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          if (result.user.role === "Admin") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate(redirectPath, { replace: true });
          }
        }, 2000);
      } else {
        toast.error(result.message || "Invalid credentials", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="bg-[#2B2B2B] text-[#D4D4D4]"
        progressClassName="bg-[#B3B3B3]"
      />

      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-[#2B2B2B] p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#D4D4D4] p-3 rounded-full mb-3">
              <Lock size={24} className="text-[#2B2B2B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#B3B3B3]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full pl-10 pr-4 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border ${errors.email ? "border-red-500" : "border-[#B3B3B3]"} focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#B3B3B3]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-10 pr-10 py-2 bg-[#1F1F1F] text-[#D4D4D4] rounded-md border ${errors.password ? "border-red-500" : "border-[#B3B3B3]"} focus:outline-none focus:ring-1 focus:ring-[#D4D4D4] placeholder-[#B3B3B3]`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-[#B3B3B3] hover:text-[#D4D4D4]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#D4D4D4] text-[#2B2B2B] font-medium py-2 rounded-md hover:bg-[#B3B3B3] transition-colors duration-200 flex items-center justify-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2B2B2B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#B3B3B3]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#D4D4D4] font-medium hover:underline hover:text-[#FFFFFF]"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
