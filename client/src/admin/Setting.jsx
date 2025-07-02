import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Lock, Bell, Mail, CreditCard, Database } from 'lucide-react';

function Settings() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-[#2B2B2B] text-[#FFFFFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center mb-3">
            <SettingsIcon className="text-[#FFFFFF] mr-3" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>
          </div>
          <p className="text-[#B3B3B3]">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFFFFF] rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#2B2B2B]">Settings Menu</h3>
              <nav className="space-y-2">
                <a href="#profile" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <User className="mr-3" size={18} />
                  Profile
                </a>
                <a href="#security" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <Lock className="mr-3" size={18} />
                  Security
                </a>
                <a href="#notifications" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <Bell className="mr-3" size={18} />
                  Notifications
                </a>
                <a href="#email" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <Mail className="mr-3" size={18} />
                  Email Settings
                </a>
                <a href="#billing" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <CreditCard className="mr-3" size={18} />
                  Billing
                </a>
                <a href="#data" className="flex items-center p-3 rounded hover:bg-[#D4D4D4] transition text-[#2B2B2B]">
                  <Database className="mr-3" size={18} />
                  Data & Privacy
                </a>
              </nav>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <section id="profile" className="bg-[#FFFFFF] rounded-lg shadow p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 md:mb-6 flex items-center text-[#2B2B2B]">
                <User className="mr-3 text-[#2B2B2B]" size={20} />
                Profile Settings
              </h3>
              <form className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                      defaultValue="Admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                      defaultValue="User"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                    defaultValue="admin@clothora.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Bio</label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                    defaultValue="Administrator account for ClothOra e-commerce platform"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Security Section */}
            <section id="security" className="bg-[#FFFFFF] rounded-lg shadow p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 md:mb-6 flex items-center text-[#2B2B2B]">
                <Lock className="mr-3 text-[#2B2B2B]" size={20} />
                Security Settings
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-[#2B2B2B]">Change Password</h4>
                  <form className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-md py-2 px-3 text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] font-medium py-2 px-6 rounded-md transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="pt-4 md:pt-6 border-t border-[#D4D4D4]">
                  <h4 className="font-medium mb-3 text-[#2B2B2B]">Two-Factor Authentication</h4>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-sm text-[#B3B3B3]">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      type="button"
                      className="bg-[#D4D4D4] hover:bg-[#B3B3B3] text-[#2B2B2B] font-medium py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section id="notifications" className="bg-[#FFFFFF] rounded-lg shadow p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 md:mb-6 flex items-center text-[#2B2B2B]">
                <Bell className="mr-3 text-[#2B2B2B]" size={20} />
                Notification Preferences
              </h3>
              <form className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2B2B2B]">Email Notifications</p>
                    <p className="text-sm text-[#B3B3B3]">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#D4D4D4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFFFFF] after:border-[#D4D4D4] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2B2B]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2B2B2B]">Order Alerts</p>
                    <p className="text-sm text-[#B3B3B3]">Get notified for new orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#D4D4D4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFFFFF] after:border-[#D4D4D4] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2B2B]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2B2B2B]">Promotional Offers</p>
                    <p className="text-sm text-[#B3B3B3]">Receive special offers and discounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#D4D4D4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFFFFF] after:border-[#D4D4D4] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2B2B]"></div>
                  </label>
                </div>
                <div className="flex justify-end pt-3 md:pt-4">
                  <button
                    type="button"
                    className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;