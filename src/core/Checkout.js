/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getBraintreeClientToken, processPayment } from './apiCore';
import { emptyCart } from './cartHelpers';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    success: false,
    loading: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({
          ...data,
          error: data.error,
        });
      } else {
        setData({
          clientToken: data.clientToken,
        });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-primary'>Sign in to checkout</button>
      </Link>
    );
  };

  const buy = () => {
    setData({ loading: true });
    // send nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        // Once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            setData({
              ...data,
              success: response.success,
            });
            // empty cart
            emptyCart(() => {
              console.log('payment success and empty cart');
              setRun(true);
              setData({ loading: false });
            });
            // create order
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        setData({
          ...data,
          error: error.message,
        });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) =>
              setData({
                ...data,
                instance,
              })
            }
          />
          <button onClick={buy} className='btn btn-success btn-block'>
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showLoading = (loading) => loading && <h2>Loading...</h2>;

  const showSuccess = (success) => (
    <div
      className='alert alert-info'
      style={{ display: success ? '' : 'none' }}
    >
      Thanks! Your payment was successful!
    </div>
  );
  return (
    <div>
      <h2>Total: £{getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
