// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const Dashboard = () => {
//   const [gigs, setGigs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       if (user?.role === 'client') {
//         // Fetch client's posted gigs
//         const response = await axios.get('http://localhost:5000/api/gigs/my-gigs');
//         setGigs(response.data);
//       } else {
//         // Fetch artist's applications
//         const response = await axios.get('http://localhost:5000/api/gigs/my-applications');
//         setApplications(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             {user?.role === 'client' ? 'Client Dashboard' : 'Artist Dashboard'}
//           </h1>
//           <p className="mt-2 text-gray-600">
//             {user?.role === 'client' 
//               ? 'Manage your posted gigs and applications' 
//               : 'Track your gig applications and status'
//             }
//           </p>
//         </div>

//         {user?.role === 'client' ? (
//           <ClientDashboard gigs={gigs} />
//         ) : (
//           <ArtistDashboard applications={applications} />
//         )}
//       </div>
//     </div>
//   );
// };

// const ClientDashboard = ({ gigs }) => (
//   <div className="space-y-6">
//     <h2 className="text-2xl font-semibold text-gray-900">Your Posted Gigs</h2>
    
//     {gigs.length === 0 ? (
//       <div className="text-center py-12">
//         <p className="text-xl text-gray-600">You haven't posted any gigs yet.</p>
//         <a 
//           href="/create-gig" 
//           className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//         >
//           Post Your First Gig
//         </a>
//       </div>
//     ) : (
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {gigs.map((gig) => (
//           <div key={gig._id} className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
//             <p className="text-gray-600 mb-4">{gig.description}</p>
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-green-600 font-bold">${gig.budget}</span>
//               <span className={`px-2 py-1 rounded text-sm ${
//                 gig.status === 'open' ? 'bg-green-100 text-green-800' :
//                 gig.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-gray-100 text-gray-800'
//               }`}>
//                 {gig.status.replace('_', ' ')}
//               </span>
//             </div>
//             <div className="text-sm text-gray-500">
//               Applications: {gig.applications?.length || 0}
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// const ArtistDashboard = ({ applications }) => (
//   <div className="space-y-6">
//     <h2 className="text-2xl font-semibold text-gray-900">Your Applications</h2>
    
//     {applications.length === 0 ? (
//       <div className="text-center py-12">
//         <p className="text-xl text-gray-600">You haven't applied to any gigs yet.</p>
//         <a 
//           href="/" 
//           className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//         >
//           Browse Available Gigs
//         </a>
//       </div>
//     ) : (
//       <div className="space-y-4">
//         {applications.map((app) => (
//           <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.gig?.title}</h3>
//             <p className="text-gray-600 mb-4">{app.proposal}</p>
//             <div className="flex justify-between items-center">
//               <span className="text-green-600 font-bold">${app.gig?.budget}</span>
//               <span className="text-sm text-gray-500">
//                 Applied on {new Date(app.appliedAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

const Dashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, gig: null, artist: null });
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'client') {
        const response = await axios.get('http://localhost:5000/api/gigs/my-gigs');
        setGigs(response.data);
      } else {
        const response = await axios.get('http://localhost:5000/api/gigs/my-applications');
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (gig, artist) => {
    setPaymentModal({ isOpen: true, gig, artist });
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful! The artist has been notified.');
    fetchDashboardData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'client' ? 'Client Dashboard' : 'Artist Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'client' 
              ? 'Manage your posted gigs and make payments' 
              : 'Track your gig applications and earnings'
            }
          </p>
        </div>

        {user?.role === 'client' ? (
          <ClientDashboard gigs={gigs} onPayment={handlePayment} />
        ) : (
          <ArtistDashboard applications={applications} />
        )}

        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, gig: null, artist: null })}
          gig={paymentModal.gig}
          artist={paymentModal.artist}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

const ClientDashboard = ({ gigs, onPayment }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-900">Your Posted Gigs</h2>
    
    {gigs.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">You haven't posted any gigs yet.</p>
        <a 
          href="/create-gig" 
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Post Your First Gig
        </a>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gigs.map((gig) => (
          <div key={gig._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
            <p className="text-gray-600 mb-4">{gig.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-600 font-bold">${gig.budget}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                gig.status === 'open' ? 'bg-green-100 text-green-800' :
                gig.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {gig.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                Applications: {gig.applications?.length || 0}
              </div>
              
              {gig.applications?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Applications:</h4>
                  {gig.applications.map((app) => (
                    <div key={app._id} className="border rounded p-3 bg-gray-50">
                      <p className="font-medium">{app.artist?.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{app.proposal}</p>
                      <button
                        onClick={() => onPayment(gig, app.artist)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Pay ${gig.budget}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ArtistDashboard = ({ applications }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-900">Your Applications</h2>
    
    {applications.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">You haven't applied to any gigs yet.</p>
        <a 
          href="/" 
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Browse Available Gigs
        </a>
      </div>
    ) : (
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.gig?.title}</h3>
            <p className="text-gray-600 mb-4">{app.proposal}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">${app.gig?.budget}</span>
              <span className="text-sm text-gray-500">
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;
