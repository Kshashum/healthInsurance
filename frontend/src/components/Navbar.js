import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { TextField, makeStyles } from "@material-ui/core";
import logo from "../logo.png";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useStateValue } from "../context/StateContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
const Navbar = () => {
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
  const [{ login, name, vlist, gte, lte, ord, clickSearch }, dispatch] =
    useStateValue();
  const history = useHistory();
  const classes = useStyles();
  const [search, setsearch] = useState("");
  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (search) {
      try {
        console.log(search);
        axios
          .get("http://localhost:5000/api/v1/search", {
            params: { query: search, gte, lte, ord },
          })
          .then((res) => {
            if (res.data.hits.hits.length > 0) {
              dispatch({
                type: "SEARCH",
                item: {
                  searchlist: res.data.hits.hits.map((item) => {
                    return { ...item._source };
                  }),
                  price100_200:
                    res.data.aggregations.Price_Filter.buckets[0].doc_count,
                  price200_300:
                    res.data.aggregations.Price_Filter.buckets[1].doc_count,
                  price300_500:
                    res.data.aggregations.Price_Filter.buckets[2].doc_count,
                },
              });
              dispatch({
                type: "ADD_FILTER",
                item: { gte: 0, lte: 500 },
              });
              dispatch({
                type: "SORT",
                item: "",
              });
            } else {
              dispatch({
                type: "SEARCH",
                item: {
                  searchlist: [],
                  price100_200: 0,
                  price200_300: 0,
                  price300_500: 0,
                },
              });
            }
          });
      } catch (err) {
        console.log(err.message);
        dispatch({
          type: "SEARCH",
          item: {
            searchlist: [],
            price100_200: 0,
            price200_300: 0,
            price300_500: 0,
          },
        });
      }
    }
    history.push("/s");
    setsearch("");
  };
  useEffect(() => {
    if (clickSearch) {
      handleSearch(null);
    }
  }, [clickSearch]);
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
          value={search}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setsearch(e.target.value);
          }}
          variant="filled"
          className={classes.root}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch(e);
            }
          }}
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
            <ShoppingCartIcon />
            <p className="navbar_optionslinetwo navbar_cartcount">
              {vlist.length > 0 ? vlist.length : ""}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
