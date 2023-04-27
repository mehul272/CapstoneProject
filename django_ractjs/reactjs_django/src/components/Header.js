import React from 'react';
import '../resources/css/Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-logo">
        <img src="https://static.thenounproject.com/png/3147308-200.png" alt="Logo" height="65" />
      </div>
      <div className="header-heading">
        <h3>Pipeline Phase 1: Extract</h3>
      </div>
    </div>
  );
};

export default Header;