import { React, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useStateValue } from "../context/StateContext";
import { TextField, Typography, Button } from "@material-ui/core";

const AdminLogin = () => {
  const [{ admin }, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  useEffect(() => {
    if (admin) {
      history.push("/admin");
    }
  }, [admin, history]);
  const validate = () => {
    let errors = {};
    let isValid = true;
    if (email.length === 0) {
      isValid = false;
      errors["email"] = "Please enter your email Address.";
    }
    if (email.length > 0) {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );

      if (!pattern.test(email)) {
        isValid = false;
        errors["email"] = "Please enter valid email address.";
      }
    }

    if (password.length === 0) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }
    setErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      axios
        .post("http://localhost:5000/api/v1/users/adminlogin", {
          email,
          password,
        })
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          if (data.token) {
            dispatch({
              type: "ADMIN",
              item: {
                token: data.token,
              },
            });
            history.push("/admin");
          }
        })
        .catch((err) => {
          setEmail("");
          setPassword("");
          setErrors({ check: "Invalid Email or Password" });
        });
    }
  };
  return (
    <div className="login">
      <div className="container">
        <div className="login_split">
          <Typography variant="h4">Admin Login</Typography>
          <form
            className="login_form"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="text-danger">{errors["check"]}</div>
            <Typography variant="h6" style={{ marginTop: "5px" }}>
              Email
            </Typography>
            <TextField
              type="email"
              style={{ marginTop: "5px" }}
              placeholder="something@mail.com"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></TextField>
            <div className="text-danger">{errors["email"]}</div>
            <Typography variant="h6" style={{ marginTop: "5px" }}>
              Password
            </Typography>
            <TextField
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ marginTop: "5px" }}
            ></TextField>
            <div className="text-danger">{errors["password"]}</div>
            <Button
              style={{
                backgroundColor: "#f0c14b",
                color: "#111",
                width: "30%",
                marginTop: "10px",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
