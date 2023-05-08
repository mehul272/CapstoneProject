import React from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const EndComponent = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Thank You!</h1>
      <p>Your request has been processed successfully.</p>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default EndComponent;
