import React from 'react';
import '../resources/css/Header.css';
import { useNavigate } from "react-router-dom";

const Header = ({ phaseNumber, phaseName, imgSource }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
  <div className="header">
    <div className="header-logo">
      <img src={imgSource} alt="Logo" height="65" />
    </div>
    <div className="header-heading tracking-in-expand">
      <h3>Pipeline Phase {phaseNumber}: {phaseName}</h3>
    </div>
    <div className='space-between'>
      <br></br>
      <br></br>
    </div>
    <div className="header-links">
      <a href="/">Home</a>
      <a href="/extract">Extract</a>
      <a href="/load">Load</a>
    </div>
    <div className="header-logout">
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
);
};

export default Header;