/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getBraintreeClientToken } from './apiCore';

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    success: false,
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
          ...data,
          clientToken: data.clientToken,
          success: true,
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

  const showDropIn = () => (
    <div>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken,
            }}
            onInstance={(instance) => (instance = instance)}
          />
          <button className='btn btn-success'>Pay</button>
        </div>
      ) : null}
    </div>
  );

  return (
    <div>
      <h2>Total: £{getTotal()}</h2>
      {showCheckout()}
    </div>
  );
};

export default Checkout;
