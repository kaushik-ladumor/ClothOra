import React, { useState, useEffect } from 'react';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show notification popup
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

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
        showNotification('Failed to load users', 'error');
      });
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteId(userId);
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

      showNotification('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to delete user', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8 relative">
      {/* Notification Popup */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'error' 
            ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-100 border-l-4 border-green-500 text-green-700'
        }`}>
          <svg 
            className={`h-6 w-6 mr-2 ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={notification.type === 'error' ? 
                "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" : 
                "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              } 
            />
          </svg>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ ...notification, show: false })}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-1">Manage Users</h1>
            <p className="text-[#B3B3B3] text-sm">
              {users.length} {users.length === 1 ? 'user' : 'users'} in system
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-[#B3B3B3]"
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
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3B3B3] text-[#FFFFFF] placeholder-[#B3B3B3]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFFFFF]"></div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] rounded-lg shadow-lg overflow-hidden border border-[#D4D4D4]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#D4D4D4]">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#FFFFFF] divide-y divide-[#D4D4D4]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-[#F8F8F8] transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D4D4D4] flex items-center justify-center text-[#2B2B2B] font-medium">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#2B2B2B]">{user.name}</div>
                              <div className="text-xs text-[#B3B3B3]">
                                {user.role === 'Admin' ? 'Administrator' : 'Standard User'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#2B2B2B]">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-[#2B2B2B] text-[#FFFFFF]' : 'bg-[#D4D4D4] text-[#2B2B2B]'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#2B2B2B]">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.role !== 'Admin' ? (
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={isDeleting && deleteId === user._id}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                                isDeleting && deleteId === user._id
                                  ? 'bg-gray-300 text-gray-600'
                                  : 'bg-[#2B2B2B] text-[#FFFFFF] hover:bg-[#B3B3B3] transition-colors'
                              }`}
                            >
                              {isDeleting && deleteId === user._id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg className="-ml-1 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-[#B3B3B3] text-sm">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-[#B3B3B3]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-[#2B2B2B]">No users found</h3>
                        <p className="mt-1 text-sm text-[#B3B3B3]">
                          {searchTerm ? 'Try adjusting your search' : 'No users in the system'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;