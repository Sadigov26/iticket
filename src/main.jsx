// import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { RouterApp } from './Components/utils/RouterApp';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
<RouterProvider router={RouterApp} />
  //  </React.StrictMode> 
)
