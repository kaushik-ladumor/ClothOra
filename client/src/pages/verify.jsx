import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from location state if coming from signup
    if (location.state?.email) {
      setEmail(location.state.email);
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
    setError("");
    
    if (code.length !== 6) {
      return setError("Code must be 6 digits");
    }

    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:8080/auth/verifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode: code })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Verification failed");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      navigate(result.role === "Admin" ? "/admin-dashboard" : "/", {
        replace: true
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:8080/auth/resendVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Failed to resend code");
      }

      setResendDisabled(true);
      setCountdown(30);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B2B2B] px-4 text-white">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-4 text-[#B3B3B3] hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        
        <form onSubmit={handleSubmit} className="bg-[#1F1F1F] p-8 rounded-xl space-y-5">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="bg-[#333] p-3 rounded-full">
              <CheckCircle size={28} className="text-[#FDD835]" />
            </div>
            <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
            {email && (
              <p className="text-sm text-[#B3B3B3] text-center">
                Code sent to <span className="font-medium text-white">{email}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setCode(value);
                }}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-[#333] rounded-md text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FDD835]"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FDD835] hover:bg-[#FBC02D] text-black font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
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
                  className="text-[#FDD835] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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