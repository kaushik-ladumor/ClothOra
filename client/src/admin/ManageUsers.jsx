import React, { useState, useEffect } from 'react';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/admin/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setIsLoading(false);
      });
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      alert("✅ User deleted successfully.");
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("❌ " + err.message);
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">Manage Users</h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFFFFF] text-[#FFFFFF] placeholder-[#B3B3B3]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-[#B3B3B3]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFFFFF]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#D4D4D4] shadow">
            <table className="min-w-full divide-y divide-[#D4D4D4]">
              <thead className="bg-[#FFFFFF]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#2B2B2B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#FFFFFF] divide-y divide-[#D4D4D4]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-[#F5F5F5] transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#2B2B2B]">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#2B2B2B]">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-[#2B2B2B] text-[#FFFFFF]' 
                            : 'bg-[#D4D4D4] text-[#2B2B2B]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {user.isVerified ? (
                          <span className="text-green-600 font-medium">Verified</span>
                        ) : (
                          <span className="text-[#B3B3B3] font-medium">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#2B2B2B]">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== 'Admin' ? (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-[#FFFFFF] bg-[#2B2B2B] hover:bg-[#B3B3B3] px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-[#B3B3B3] text-xs sm:text-sm">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-sm text-[#B3B3B3]">
                      No users found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;