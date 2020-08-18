import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getUserPurchaseHistory } from './apiUser';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const {
    user: { name, email, role, _id },
    token,
  } = isAuthenticated();

  const init = () => {
    getUserPurchaseHistory(_id, token).then((data) => {
      console.log(data);
      if (data.error) {
        console.log('Error in fetching user purchase history', data.error);
      } else {
        setHistory(data);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const userLinks = () => {
    return (
      <div className='card'>
        <h4 className='card-header'>User Links</h4>
        <li className='list-group-item'>
          <Link className='nav-link' to='/cart'>
            My Cart
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to={`/profile/${_id}`}>
            Update Profile
          </Link>
        </li>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header'>User Information</h3>
        <ul className='list-group'>
          <li className='list-group-item'>{name}</li>
          <li className='list-group-item'>{email}</li>
          <li className='list-group-item'>
            {role === 1 ? 'Admin' : 'Registered User'}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = (history) => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header'>Purchase history</h3>
        <ul className='list-group'>
          <li className='list-group-item'>
            {history.map((h, i) => {
              return (
                <div>
                  <hr />
                  {h.products.map((p, i) => {
                    return (
                      <div key={i}>
                        <h6>Product name: {p.name}</h6>
                        <h6>Product price: £{p.price}</h6>
                        <h6>Purchased date: {moment(p.createdAt).fromNow()}</h6>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title='Dashboard Page'
      description={`G'Day ${name}!`}
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-3'>{userLinks()}</div>
        <div className='col-9'>
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
