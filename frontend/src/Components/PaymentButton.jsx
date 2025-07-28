import React, { useState } from 'react';
import './Comp.css';
import Cookies from 'js-cookie';


function PaymentButton() {
  const [paymentLoading, setPaymentLoading] = useState(false);
const email=Cookies.get('email');
  const handlePayment = async () => {
    setPaymentLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50000, currency: 'INR' }),
      });

      const data = await res.json();

      if (data.id) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          order_id: data.id,
          name: 'Real Estate Payment',
          description: 'Property Booking',
          handler: function (response) {
            alert(`Payment successful: ${response.razorpay_payment_id}`);
            setPaymentLoading(false);
          },
          prefill: {
           
            email: email,
            
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        alert('Order creation failed');
        setPaymentLoading(false);
      }
    } catch (error) {
      alert('Payment initiation failed');
      console.error(error);
      setPaymentLoading(false);
    }
  };

  return (
    <div className='div_01'>
    <div className="card payment-container" >
      <img className="card-img-top" src="https://d2kh7o38xye1vj.cloudfront.net/wp-content/uploads/2021/12/razorpay-feature.png" alt="Payment" />
      <div className="card-body payment-card">
        <h5 className="card-title payment-heading">Secure Payment</h5>
        <p className="card-text payment-description">
          You're one step away from booking your dream property. Please click below to make a secure payment.
        </p>
        <button onClick={handlePayment} disabled={paymentLoading} className="btn btn-primary payment-button">
          {paymentLoading ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>
    </div>
    </div>
  );
}

export default PaymentButton;
