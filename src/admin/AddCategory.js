import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createCategory } from './adminAPI';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const handleNameChange = (e) => {
    setError('');
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setSuccess(false);
        setError(data.error);
      } else {
        setError('');
        setSuccess(true);
      }
    });
  };

  const showError = () => {
    if (error) {
      return <div className='alert alert-danger'>Category Already Exists</div>;
    }
  };

  const showSuccess = () => {
    if (success) {
      return <div className='alert alert-success'> Category Created </div>;
    }
  };

  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Back to Dashboard
      </Link>
    </div>
  );

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='name' className='text-muted'>
          Name
        </label>
        <input type='text' className='form-control' value={name} autoFocus onChange={handleNameChange} />
      </div>
      <button className='btn btn-outline-primary'>Create Category</button>
    </form>
  );

  return (
    <Layout title='Dashboard Page' description={`G'Day ${user.name}, ready to add new category?`}>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showError()}
          {showSuccess()}
          {newCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
