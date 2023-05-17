import React, { useState } from "react";
import AppNavbar from "./Navbar";
import axios from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import "../resources/css/login.css";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function validateEmail(email) {
  const regex = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,5})$/;
  return regex.test(email);
}

const EmptyLoginData = () => {
  cloneDeep({
    email: "",
    password: "",
  });
};

const EmptyRegisterData = () => {
  cloneDeep({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
};

function Login() {
  let api = "http://127.0.0.1:8000/api";

  const navigate = useNavigate();

  const [justifyActive, setJustifyActive] = useState("tab1");

  const [loginData, setLoginData] = useState(EmptyLoginData());
  const [registerData, setRegisterData] = useState(EmptyRegisterData());
  const [checkEmail, setCheckEmail] = useState(true);

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleDataChangeLogin = (key, login) => {
    setLoginData((data) => {
      return { ...data, [key]: login };
    });
  };

  const handleDataChangeRegister = (key, register) => {
    if (key === "email") {
      if (!validateEmail(register)) {
        setCheckEmail(false);
      } else {
        setCheckEmail(true);
      }
    }

    if (checkEmail) {
      setRegisterData((data) => {
        return { ...data, [key]: register };
      });
    }
  };

  const handleRegisterUser = async () => {
    if (registerData === undefined) {
      toast.warning("Please Enter the Details to Register");
    } else {
      await axios
        .get(api + `/register-user`, {
          params: {
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            cpassword: registerData.cpassword,
          },
        })
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.data);
            navigate("/extract");
          } else {
            toast.error(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleLoginUser = async () => {
    console.log(loginData);
    if (loginData === undefined) {
      toast.warning("Please Enter the Details to Login");
    } else {
      await axios
        .get(api + `/login-user`, {
          params: {
            email: loginData.email,
            password: loginData.password,
          },
        })
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.data);
            navigate("/extract");
          } else {
            toast.error(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div>
        <AppNavbar />
      </div>
      <div className="login-body">
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
          <MDBTabs
            pills
            justify
            className="mb-3 d-flex flex-row justify-content-between"
          >
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleJustifyClick("tab1")}
                active={justifyActive === "tab1"}
              >
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleJustifyClick("tab2")}
                active={justifyActive === "tab2"}
              >
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={justifyActive === "tab1"}>
              <MDBInput
                wrapperClass="mb-4"
                label="UserName"
                id="form1"
                onChange={(event) => {
                  handleDataChangeLogin("email", event.target.value);
                }}
                type="text"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                onChange={(event) => {
                  handleDataChangeLogin("password", event.target.value);
                }}
                type="password"
              />

              <button
                className="button-9"
                role="button"
                onClick={handleLoginUser}
              >
                {" "}
                Sign in
              </button>
            </MDBTabsPane>

            <MDBTabsPane show={justifyActive === "tab2"}>
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="form1"
                type="text"
                onChange={(event) => {
                  handleDataChangeRegister("username", event.target.value);
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                id="form1"
                type="email"
                style={{ borderColor: checkEmail ? "" : "red" }}
                onChange={(event) => {
                  handleDataChangeRegister("email", event.target.value);
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form1"
                type="password"
                onChange={(event) => {
                  handleDataChangeRegister("password", event.target.value);
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Confirm Password"
                id="form1"
                type="password"
                onChange={(event) => {
                  handleDataChangeRegister("cpassword", event.target.value);
                }}
              />

              <Button
                disabled={!checkEmail}
                className="button-9"
                role="button"
                onClick={handleRegisterUser}
              >
                {" "}
                Sign up
              </Button>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBContainer>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
