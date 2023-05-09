import React from 'react';
import '../resources/css/Header.css';

const Header = ({ phaseNumber, phaseName, imgSource }) => {
  return (
    <div className="header">
      <div className="header-logo">
        <img src={imgSource} alt="Logo" height="65" />
      </div>
      <div className="header-heading tracking-in-expand">
        <h3>Pipeline Phase {phaseNumber}: {phaseName}</h3>
      </div>
    </div>
  );
};

export default Header;