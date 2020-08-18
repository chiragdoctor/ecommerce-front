import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';

const Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
  });
  const { token } = isAuthenticated();

  const { name, email, password, success, error } = values;

  const init = (userId, token) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: true,
        });
      }
      setValues({
        ...values,
        name: data.name,
        email: data.email,
      });
    });
  };

  useEffect(() => {
    init(match.params.userId, token);
  }, []);

  const handleChange = (key) => (e) => {
    setValues({
      ...values,
      error: false,
      [key]: e.target.value,
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    update(match.params.userId, token, { name, email, password }).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: true, success: false });
        } else {
          updateUser(data, () => {
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            });
          });
        }
      },
    );
  };

  const redirectUser = (success) => {
    if (success) {
      return <Redirect to='/cart' />;
    }
  };

  const profileUpdate = (name, email, password) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          className='form-control'
          onChange={handleChange('name')}
          value={name}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          type='email'
          className='form-control'
          onChange={handleChange('email')}
          value={email}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          type='password'
          className='form-control'
          onChange={handleChange('password')}
        />
      </div>
      <button type='password' className='btn btn-primary' onClick={clickSubmit}>
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title='Profile'
      description={`Update your profile, ${values.name}`}
      className='container-fluid'
    >
      <h2 className='mb-4'>Profile Update</h2>
      {JSON.stringify(values)}
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
