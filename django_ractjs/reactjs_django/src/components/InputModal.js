import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import "../resources/css/inputModal.css"

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

function InputModal(props) {
  const classes = useStyles();

  const [inputValue, setInputValue] = useState("");

  const handleClose = (confirmed) => {
    props.onClose(confirmed);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (confirmed) => {
    console.log("hi", inputValue)
    props.updateTableName(inputValue);
    handleClose(false)
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
          <h2 id="transition-modal-title">
            <label>
              Provide Table Name: 
            </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
          </h2>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginRight: "1rem" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default InputModal;
