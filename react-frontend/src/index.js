import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './store'
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Account from './pages/account/account';
import NotFoundComponent from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path:"*",
    element: <NotFoundComponent />
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="600481405386-ildo9fnlj43mdctp5qcp1t65ssljrcgk.apps.googleusercontent.com">
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
