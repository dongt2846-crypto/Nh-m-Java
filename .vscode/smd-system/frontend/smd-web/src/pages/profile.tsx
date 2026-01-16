import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Layout from '../components/Layout';

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  department?: string;
  phoneNumber?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    department: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getById(user?.id || 0);
      const userData = response.data;
      setProfile(userData);
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        department: userData.department || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await userAPI.update(user?.id || 0, formData);
      await fetchProfile();
      setEditing(false);
      // Update auth context
      updateUser({ ...user, ...formData });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return 'System Administrator';
      case 'LECTURER': return 'Lecturer';
      case 'HOD': return 'Head of Department';
      case 'ACADEMIC_AFFAIRS': return 'Academic Affairs';
      case 'PRINCIPAL': return 'Principal';
      case 'STUDENT': return 'Student';
      default: return 'User';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-indigo-600">
                {profile?.fullName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-6 text-white">
              <h2 className="text-2xl font-bold">{profile?.fullName || 'User'}</h2>
              <p className="text-indigo-100">{profile?.email}</p>
              <p className="text-indigo-100 text-sm mt-1">{getRoleDisplayName(profile?.role || '')}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      fullName: profile?.fullName || '',
                      phoneNumber: profile?.phoneNumber || '',
                      department: profile?.department || ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile?.fullName || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile?.email}</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile?.phoneNumber || 'Not provided'}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile?.department || 'Not provided'}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{getRoleDisplayName(profile?.role || '')}</p>
            </div>

            {/* Account Created */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
