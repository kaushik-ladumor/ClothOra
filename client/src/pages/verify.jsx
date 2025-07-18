import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setRole(location.state.role || "User");
      toast.success(`Verification code sent to ${location.state.email}`);
    }
  }, [location.state]);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      return toast.error("Code must be 6 digits");
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Verifying your code...");

    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const res = await fetch(`${API_URL}auth/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode: code }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Verification failed");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      toast.success("Email verified successfully!", { id: loadingToast });

      // Redirect based on role
      if (result.role === "Admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Verification failed. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Resending verification code...");

    try {
      const res = await fetch("http://localhost:8080/auth/resendVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to resend code");
      }

      setResendDisabled(true);
      setCountdown(30);
      toast.success(`New code sent to ${email}`, { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to resend code", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B2B2B] px-4 text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#2B2B2B",
            color: "#FFFFFF",
            border: "1px solid #D4D4D4",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#FFFFFF",
              secondary: "#2B2B2B",
            },
          },
          error: {
            duration: 4000,
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-4 text-[#D4D4D4] hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-[#2B2B2B] p-8 rounded-xl space-y-5 border border-[#D4D4D4]"
        >
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="bg-[#2B2B2B] p-3 rounded-full border border-[#D4D4D4]">
              <CheckCircle size={28} className="text-[#FFFFFF]" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white">
              Verify Your Email
            </h2>
            {email && (
              <p className="text-sm text-[#B3B3B3] text-center">
                Code sent to{" "}
                <span className="font-medium text-white">{email}</span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium mb-1 text-[#D4D4D4]"
              >
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) setCode(value);
                }}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-[#2B2B2B] border border-[#D4D4D4] rounded-md text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-[#D4D4D4] text-[#2B2B2B] font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors border border-[#D4D4D4]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="text-center text-sm text-[#B3B3B3]">
              <p>
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendDisabled || isLoading}
                  className="text-white hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Verify;
