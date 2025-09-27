import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'

// Importar rotas
import Home from './routes/Home';
import WhoIsUs from './routes/WhoIsUs'
import OurTeams from './routes/OurTeams.jsx'
import Products from './routes/Products'
import Contact from './routes/Contact';
import Login from './routes/Login'
import Register from './routes/Register.jsx';
import MyAccount from './routes/MyAccount.jsx'
import AdminPage from './routes/AdminPage.jsx';
import ProductDetail from './routes/ProductDetail.jsx';

// Importar rotas dos produtos
import Product1 from './routes/products/routes-products/Product1.jsx';
import Product2 from './routes/products/routes-products/Product2.jsx';
import Product3 from './routes/products/routes-products/Product3.jsx';
import Product4 from './routes/products/routes-products/Product4.jsx';
import Product5 from './routes/products/routes-products/Product5.jsx';
import Product6 from './routes/products/routes-products/Product6.jsx';
import Product7 from './routes/products/routes-products/Product7.jsx';
import Product8 from './routes/products/routes-products/Product8.jsx';
import Product9 from './routes/products/routes-products/Product9.jsx';

import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",      //Manter o nome do reposítorio do git para funcionar a page, para voltar a usar o local host precisa tirar o nome do repositorio
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "who-is-us",
        element: <WhoIsUs/>
      },
      {
        path: "our-teams",
        element: <OurTeams/>
      },
      {
        path: "products",
        element: <Products/>
      },
      {
        path: "contact",
        element: <Contact/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "my-account",
        element: <MyAccount/>
      },
      {
        path: "admin-page",
        element: <AdminPage/>
      },
      {
        path: "product1",
        element: <Product1/>
      },
      {
        path: "product/:id",
        element: <ProductDetail />
      },  
    ],
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)