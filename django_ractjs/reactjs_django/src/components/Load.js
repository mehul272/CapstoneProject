import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Load = (loadComplete) => {
  const classes = useStyles();

  console.log("hi", loadComplete);

  return (
    <>
      <h1>Loading...</h1>
      {loadComplete.loadComplete ? (
        <>
          <h1>Done</h1>
        </>
      ) : (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Load;
