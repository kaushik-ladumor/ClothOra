import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_KEY
    fetch(`${API_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setProfile(data.user || data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load profile. Redirecting to login...");
        setIsLoading(false);
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 3000);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2B2B2B] text-white gap-4 p-4">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-lg text-center">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2B2B2B] text-white gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B3B3B3]"></div>
        <p className="text-[#D4D4D4]">Loading your profile...</p>
      </div>
    );
  }

  const formattedDate = new Date(profile.createdAt).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#2B2B2B] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-10 transition-all hover:shadow-2xl">
        {/* Profile Image with gradient border */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#B3B3B3] to-[#2B2B2B] rounded-full blur opacity-75"></div>
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&auto=format&fit=crop&q=80"
            alt={profile.name}
            className="relative rounded-full w-28 h-28 md:w-36 md:h-36 object-cover border-4 border-white"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2B2B2B]">
                {profile.name}
              </h1>
              <p className="text-base text-[#2B2B2B] opacity-80">
                {profile.role || "Member"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                profile.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {profile.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="flex items-center text-[#2B2B2B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#B3B3B3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {profile.email}
            </p>
            <p className="flex items-center text-sm text-[#2B2B2B] opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-[#B3B3B3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Joined: {formattedDate}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D4D4D4]">
            <p className="text-sm italic text-[#2B2B2B] opacity-80 mb-4">
              Welcome back, {profile.name.split(" ")[0]}! 🎉 We're glad to see
              you again.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-[#2B2B2B] text-white rounded-md hover:bg-opacity-90 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
              <button className="px-5 py-2 bg-white text-[#2B2B2B] border border-[#D4D4D4] rounded-md hover:bg-[#F5F5F5] transition flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <Link to='/my-orders'>My Order</Link>
              </button>
              <button className="px-5 py-2 bg-white text-[#2B2B2B] border border-[#D4D4D4] rounded-md hover:bg-[#F5F5F5] transition flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <Link to='/update-password'>UpdatePassword</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;