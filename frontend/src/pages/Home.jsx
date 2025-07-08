import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gigs');
      setGigs(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (gigId) => {
    const proposal = prompt('Enter your proposal:');
    if (!proposal) return;

    try {
      await axios.post(`http://localhost:5000/api/gigs/${gigId}/apply`, {
        proposal
      });
      alert('Application submitted successfully!');
      fetchGigs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    }
  };

  const categories = ['all', ...new Set(gigs.map(gig => gig.category))];
  const filteredGigs = filter === 'all' ? gigs : gigs.filter(gig => gig.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Welcome to <span className="text-yellow-300">ArtSpace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Connect with talented artists and discover amazing creative opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <>
                  <a 
                    href="/register" 
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                  >
                    Get Started
                  </a>
                  <a 
                    href="/login" 
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                  >
                    Sign In
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Browse Available Gigs
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  filter === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Gigs Grid */}
        {filteredGigs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs available</h3>
            <p className="text-gray-600">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGigs.map((gig) => (
              <div key={gig._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                        {gig.title}
                      </h3>
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                        {gig.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-secondary-600">${gig.budget}</span>
                      <span className="text-sm text-gray-500">Budget</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(gig.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {gig.client?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">by {gig.client?.name}</span>
                    </div>
                    
                    {user?.role === 'artist' && (
                      <button
                        onClick={() => handleApply(gig._id)}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
