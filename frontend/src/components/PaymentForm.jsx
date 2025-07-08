// import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51ReyyvPpjBa0AuBBf5Jsg5x1a1lkBOjXGBbNDe4M834ISPPhfGLvtcHraP3OfibUKSGqljIXkZ9YYEy9ObQ1X9XZ00FMdFoNg2');

// const CheckoutForm = ({ amount, gigId, artistId, onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) return;

//     setProcessing(true);
//     setError(null);

//     try {
//       // Create payment intent
//       const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
//         amount,
//         gigId,
//         artistId
//       });

//       // Confirm payment
//       const result = await stripe.confirmCardPayment(data.clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         }
//       });

//       if (result.error) {
//         setError(result.error.message);
//       } else {
//         // Confirm payment on backend
//         await axios.post('http://localhost:5000/api/payments/confirm-payment', {
//           paymentIntentId: result.paymentIntent.id,
//           gigId,
//           artistId,
//           amount
//         });

//         onSuccess();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Payment failed');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="p-4 border rounded-lg">
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 fontSize: '16px',
//                 color: '#424770',
//                 '::placeholder': {
//                   color: '#aab7c4',
//                 },
//               },
//             },
//           }}
//         />
//       </div>

//       {error && (
//         <div className="text-red-600 text-sm">{error}</div>
//       )}

//       <button
//         type="submit"
//         disabled={!stripe || processing}
//         className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//       >
//         {processing ? 'Processing...' : `Pay $${amount}`}
//       </button>
//     </form>
//   );
// };

// const PaymentForm = ({ amount, gigId, artistId, onSuccess }) => {
//   return (
//     <Elements stripe={stripePromise}>
//       <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
//         <CheckoutForm
//           amount={amount}
//           gigId={gigId}
//           artistId={artistId}
//           onSuccess={onSuccess}
//         />
//       </div>
//     </Elements>
//   );
// };

// export default PaymentForm;
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, gigId, artistId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount,
        gigId,
        artistId
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Confirm payment on backend
        await axios.post('http://localhost:5000/api/payments/confirm-payment', {
          paymentIntentId: result.paymentIntent.id,
          gigId,
          artistId,
          amount
        });

        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${amount}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const PaymentForm = ({ amount, gigId, artistId, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Amount to pay:</p>
          <p className="text-2xl font-bold text-green-600">${amount}</p>
        </div>
        <CheckoutForm
          amount={amount}
          gigId={gigId}
          artistId={artistId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </Elements>
  );
};

export default PaymentForm;
