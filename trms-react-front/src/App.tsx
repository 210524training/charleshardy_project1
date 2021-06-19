import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import NavBar from './components/navBar/NavBar';
import AppRoutes from './router/AppRoutes';

const App: React.FC = (): JSX.Element => {
  return (
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  );
}

export default App;
