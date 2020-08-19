import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import {
  getProducts,
  //   getProduct,
  //   updateProduct,
  deleteProduct,
} from './adminAPI';
import { Link } from 'react-router-dom';

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log('Error in fetching products', data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(user._id, productId, token).then((data) => {
      if (data.error) {
        console.log('Error deleting product ', data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title='Manage Products'
      description='Perform CRUD on products'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-12'>
          <h2 className='text-center'>Total {products.length} products</h2>
          <hr />
          <ul className='list-group'>
            {products.map((p, i) => (
              <li
                key={i}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                <strong>{p.name}</strong>
                <Link to={`/admin/products/${p._id}`}>
                  <span className='badge badge-warning badge-pill'>Update</span>
                </Link>
                <span
                  onClick={() => destroy(p._id)}
                  className='badge badge-danger badge-pill'
                >
                  Delete
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProduct;
