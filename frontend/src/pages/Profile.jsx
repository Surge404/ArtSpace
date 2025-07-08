import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              {user.profile?.profilePicture ? (
                <img 
                  src={user.profile.profilePicture} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-primary-600 font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-white">
                <h1 className="text-2xl font-display font-bold">{user.name}</h1>
                <p className="text-primary-100 capitalize">{user.role}</p>
                <p className="text-primary-200 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  tab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Picture
              </button>
              {user.role === 'artist' && (
                <button
                  onClick={() => setTab('portfolio')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    tab === 'portfolio'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Portfolio ({user.profile?.portfolio?.length || 0})
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {tab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Picture
                  </h3>
                  {user.profile?.profilePicture && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">Current profile picture:</p>
                      <img 
                        src={user.profile.profilePicture} 
                        alt="Current profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
                      />
                    </div>
                  )}
                  <ImageUpload type="profile" />
                </div>
              </div>
            )}

            {tab === 'portfolio' && user.role === 'artist' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Portfolio Gallery
                  </h3>
                  {user.profile?.portfolio?.length > 0 && (
                    <div className="mb-8">
                      <p className="text-sm text-gray-600 mb-4">Your current portfolio:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {user.profile.portfolio.map((url, index) => (
                          <div key={url} className="group relative">
                            <img 
                              src={url} 
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Add new images to your portfolio:</h4>
                    <ImageUpload type="portfolio" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
