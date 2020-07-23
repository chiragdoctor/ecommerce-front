import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signin from './user/Signin';
import Signup from './user/Signup';
import Home from './core/Home';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/shop' exact component={Shop} />
        <Route path='/signin' exact component={Signin} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/product/:productId' exact component={Product} />
        <Route path='/cart' exact component={Cart} />
        <PrivateRoute path='/user/dashboard' exact component={UserDashboard} />
        <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
        <AdminRoute path='/create/category' exact component={AddCategory} />
        <AdminRoute path='/create/product' exact component={AddProduct} />
      </Switch>
    </Router>
  );
};

export default Routes;
