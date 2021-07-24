import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { TextField, makeStyles } from "@material-ui/core";
import logo from "../logo.png";
import { useStateValue } from "../context/StateContext";
const Navbar = () => {
  const [{ login, name, vlist }, dispatch] = useStateValue();
  const useStyles = makeStyles(() => ({
    root: {
      marginLeft: "10px",
      maxHeight: "40px",
      marginTop: "0",
      "& .MuiFilledInput-root": {
        backgroundColor: "white",
      },
      "& .MuiFilledInput-root:hover": {
        backgroundColor: "white",
        "@media (hover: none)": {
          backgroundColor: "white",
        },
      },
      "& .MuiFilledInput-root.Mui-focused": {
        backgroundColor: "white",
      },
    },
  }));
  const classes = useStyles();
  return (
    <div className="navbar">
      <Link to="/" style={{ marginLeft: "2px" }}>
        <img src={logo} alt="logo" className="navbar_image" />
      </Link>
      <form className="navbar_search">
        <TextField
          id="filled-full-width"
          label="Search"
          fullWidth
          placeholder="Search for providers in our network"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          className={classes.root}
        />
      </form>
      <div className="navbar_head">
        {login ? (
          <div className="navbar_options">
            <span className="navbar_optionslineone">Hello {name}!</span>
            <p
              className="navbar_optionslinetwo"
              onClick={() => {
                dispatch({ type: "LOGOUT" });
              }}
            >
              Logout
            </p>
          </div>
        ) : (
          <div className="navbar_options">
            <span className="navbar_optionslineone">Hello Guest!</span>
            <Link to="/login">
              <p className="navbar_optionslinetwo">login</p>
            </Link>
          </div>
        )}
        <div className="navbar_options">
          <Link to="/account">
            <p className="navbar_optionslinetwo">Account</p>
          </Link>
        </div>
        <div className="navbar_options">
          <Link to="/claims">
            <p className="navbar_optionslinetwo">My Claims</p>
          </Link>
        </div>
        <div className="navbar_options">
          <span className="navbar_optionslineone">Visit List</span>
          <Link to="/visitlist" className="navbar_shoppingcart">
            <p className="navbar_optionslinetwo navbar_cartcount">
              {vlist.length}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
