import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Signup.css";
import { useStateValue } from "../context/StateContext";
import { TextField, Typography, Button } from "@material-ui/core";

const Signup = () => {
  const [{ login }, dispatch] = useStateValue();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  useEffect(() => {
    if (login) {
      history.push("/");
    }
  }, [login, history]);
  const validate = () => {
    let errors = {};
    let isValid = true;
    if (name.length === 0) {
      isValid = false;
      errors["name"] = "please enter your name";
    }
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
    if (password.length > 0) {
      var pattern2 = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i
      );
      if (!pattern2.test(password)) {
        isValid = false;
        errors["password"] =
          "Password should have minimum eight characters, at least one letter, one number and one special character";
      }
    }
    setErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await axios
        .post("http://localhost:5000/api/v1/users/signup", {
          name,
          email,
          password,
        })
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          dispatch({
            type: "AUTHORIZE",
            item: {
              token: data.token,
              userid: data.userid,
              name: data.name,
            },
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div className="signup">
      <div className="container">
        <div className="signup_split">
          <Typography variant="h4">Sign up</Typography>
          <form className="signup_form">
            <Typography variant="h6" style={{ marginTop: "5px" }}>
              Name
            </Typography>
            <TextField
              className="form-control"
              type="text"
              placeholder="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></TextField>
            <div className="text-danger">{errors["name"]}</div>
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

export default Signup;
