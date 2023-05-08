import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ErrorModal(props) {
  const classes = useStyles();

  const handleClose = (confirmed) => {
    props.onClose(confirmed);
  };

  return (
    <Modal
      className={classes.modal}
      open={props.open}
      onClose={() => handleClose(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">Error</h2>
          <p id="transition-modal-description">{props.errorMessage}</p>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClose(true)}
              style={{ marginRight: "1rem" }}
            >
              Select Again
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClose(false)}
            >
              Stop Visualization
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default ErrorModal;
