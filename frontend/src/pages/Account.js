import React, { useEffect, useState } from "react";
import AccountRow from "../components/AccountRow";
import { useStateValue } from "../context/StateContext";
import { useHistory } from "react-router-dom";
import "./Account.css";
import axios from "axios";
import { Button, TextField } from "@material-ui/core";

const Account = () => {
  const history = useHistory();
  const [price, setPrice] = useState(0);
  const [clk, setClk] = useState(false);
  const [{ tlist, token, userid, login }, dispatch] = useStateValue();
  if (!login) {
    history.push("/login");
  }
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/transactions", {
        params: { token, userid },
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.transactions) {
          dispatch({
            type: "TRANSACTIONS",
            item: data.transactions,
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [clk]);
  const mapper = (item) => {
    return <AccountRow date={item[2]} price={item[3]} />;
  };
  const transactions = tlist.map((item) => mapper(item));
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/transactions", {
        token,
        userid,
        price,
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.transactions) {
          dispatch({
            type: "TRANSACTIONS",
            item: data.transactions,
          });
        }
        setClk(!clk);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="main">
      <h3>My Account</h3>
      <h5>History</h5>
      <table className="table table-bordered tb">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions
          ) : (
            <tr>
              <td colspan="3">There are no transactions</td>
            </tr>
          )}
        </tbody>
      </table>
      <h5>Make Payment</h5>
      <form className="payment">
        <TextField
          type="text"
          style={{ marginTop: "5px", marginRight: "2%" }}
          placeholder="$"
          name="price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Pay
        </Button>
      </form>
    </div>
  );
};

export default Account;
