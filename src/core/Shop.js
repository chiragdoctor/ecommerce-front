import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getCategories } from './apiCore';
import Layout from './Layout';
import Checkbox from './Checkbox';
import { prices } from './fixedPrices';
import Radiobox from './Radiobox';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: [],
    },
  });

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;
    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    setMyFilters(newFilters);
  };

  return (
    <Layout title='Shop Page' description='Search and find books of your choice' className='container-fluid'>
      <div className='row'>
        <div className='col-4'>
          <h4>Filter by Categories</h4>
          <ul>
            <Checkbox categories={categories} handleFilters={(filters) => handleFilters(filters, 'category')} />
          </ul>
          <h4>Filter by Price Range</h4>
          <div>
            <Radiobox prices={prices} handleFilters={(filters) => handleFilters(filters, 'price')} />
          </div>
        </div>

        <div className='col-8'>{JSON.stringify(myFilters)}</div>
      </div>
    </Layout>
  );
};

export default Shop;
