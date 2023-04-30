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

const Load = (loadComeplete) => {
  const classes = useStyles();

  console.log("hi", loadComeplete);

  return (
    <>
      <h1>Loading...</h1>
      {loadComeplete.loadComeplete ? (
        loadComeplete.loadComeplete
      ) : (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Load;
