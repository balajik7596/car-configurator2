
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './app';
import ThreeScene from './ThreeScene';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/three-scene" element={<ThreeScene />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
