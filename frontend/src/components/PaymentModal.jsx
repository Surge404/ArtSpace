import React from 'react';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ isOpen, onClose, gig, artist, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pay for Gig</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900">{gig.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Artist: {artist.name}</p>
          <p className="text-sm text-gray-600">Email: {artist.email}</p>
        </div>

        <PaymentForm
          amount={gig.budget}
          gigId={gig._id}
          artistId={artist._id}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default PaymentModal;
