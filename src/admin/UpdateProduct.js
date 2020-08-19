/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getCategories, getProduct, updateProduct } from './adminAPI';
import { Redirect } from 'react-router-dom';

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();
  const [categiroes, setCategiroes] = useState([]);
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    photo: '',
    loading: false,
    error: '',
    udpatedProduct: '',
    redirectToProfile: false,
    formData: '',
  });

  const {
    name,
    description,
    price,
    photo,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
    redirectToProfile,
  } = values;

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: '', loading: true });
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: '',
            description: '',
            price: '',
            category: '',
            shipping: '',
            quantity: '',
            photo: '',
            loading: false,
            error: '',
            createdProduct: data.name,
            redirectToProfile: true,
          });
        }
      },
    );
  };

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        console.log('Error in fetching product', data.error);
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        initCategories();
      }
    });
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
        });
      } else {
        setCategiroes(data);
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
    initCategories();
  }, []);

  const showError = () => {
    if (error) {
      return <div className='alert alert-danger'>{error}</div>;
    }
  };

  const showSuccess = () => {
    if (createdProduct) {
      return (
        <div className='alert alert-info'>{`${createdProduct} is updated!`}</div>
      );
    }
  };

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToProfile) {
      //   if (!error) {
      //     return <Redirect to='/' />;
      //   }
    }
  };

  const newPostForm = () => (
    <form className='mb-3' onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            onChange={handleChange('photo')}
            type='file'
            accept='image/*'
          />
        </label>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Product Description</label>
        <textarea
          onChange={handleChange('description')}
          type='text'
          className='form-control'
          value={description}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Price</label>
        <input
          onChange={handleChange('price')}
          type='number'
          className='form-control'
          value={price}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select onChange={handleChange('category')} className='form-control'>
          <option>Please select</option>
          {categories.map((c, i) => {
            return (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Quantity</label>
        <input
          onChange={handleChange('quantity')}
          type='number'
          className='form-control'
          value={quantity}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Shipping</label>
        <select onChange={handleChange('shipping')} className='form-control'>
          <option>Please select</option>
          <option value='0'>No</option>
          <option value='1'>Yes</option>
        </select>
      </div>
      <button className='btn btn-outline-primary'>Update Product</button>
    </form>
  );

  return (
    <Layout
      title='Dashboard Page'
      description={`G'Day ${user.name}, ready to add new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showError()}
          {showSuccess()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};
export default UpdateProduct;
