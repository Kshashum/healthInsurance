import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../context/StateContext";
import "./Admin.css";
const Admin = () => {
  const history = useHistory();
  const [{ admin, token }, dispatch] = useStateValue();
  const [price1, setprice1] = useState("");
  const [price2, setprice2] = useState("");
  const [price3, setprice3] = useState("");
  const [price4, setprice4] = useState("");
  const [price5, setprice5] = useState("");
  const [price6, setprice6] = useState("");
  const [claimid1, setclaimid1] = useState("");
  const [claimid2, setclaimid2] = useState("");
  const [dcthsid1, setdcthsid1] = useState("");
  const [dcthsid2, setdcthsid2] = useState("");
  const [dcthsid3, setdcthsid3] = useState("");
  const [userid1, setuserid1] = useState("");
  const [userid2, setuserid2] = useState("");
  const [transactionid1, settransactionid1] = useState("");
  const [transactionid2, settransactionid2] = useState("");
  const [name1, setname1] = useState("");
  const [name2, setname2] = useState("");
  const [phone1, setphone1] = useState("");
  const [phone2, setphone2] = useState("");
  const [state1, setstate1] = useState("");
  const [state2, setstate2] = useState("");
  const [city1, setcity1] = useState("");
  const [city2, setcity2] = useState("");
  const handleAddclaim = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/claims", {
        token,
        userid: userid1,
        dcthsid: dcthsid1,
        price: price1,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("added claim");
          setuserid1("");
          setdcthsid1("");
          setprice1("");
        } else {
          alert("Error in adding claim");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleUpdateclaim = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/v1/claims/${claimid1}`, {
        token,
        claimid: claimid1,
        price: price2,
      })
      .then((res) => {
        if (res.status === 204) {
          alert("updated claim");
          setclaimid1("");
          setprice2("");
        } else {
          alert("Error in updating claim");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleDeleteclaim = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/v1/claims/${claimid2}`, {
        params: { token, claimid: claimid2 },
      })
      .then((res) => {
        if (res.status === 204) {
          alert("deleted claim");
          setclaimid2("");
        } else {
          alert("Error in deleting claim");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleAddTr = (e) => {
    e.preventDefault();
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/transactions", {
        token,
        userid: userid2,
        price: price3,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("added Transaction");
          setuserid2("");
          setprice3("");
        } else {
          alert("Error in adding Transaction");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleUpdateTr = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/v1/transactions/${transactionid1}`, {
        token,
        transactionid: transactionid1,
        price: price4,
      })
      .then((res) => {
        if (res.status === 204) {
          alert("updated transaction");
          settransactionid1("");
          setprice4("");
        } else {
          alert("Error in updating transaction");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleDeleteTr = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/v1/transactions/${transactionid2}`, {
        params: { token, transactionid: transactionid2 },
      })
      .then((res) => {
        if (res.status === 204) {
          alert("deleted Transaction");
          settransactionid2("");
        } else {
          alert("Error in deleting Transaction");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleAddDH = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/dcths", {
        token,
        name: name1,
        phone: phone1,
        state: state1,
        city: city1,
        price: price5,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("added Hospital");
          setname1("");
          setcity1("");
          setphone1("");
          setprice5("");
          setstate1("");
        } else {
          alert("Error in adding Hospital");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleUpdateDH = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/v1/dcths/${dcthsid2}`, {
        token,
        dcthsid: dcthsid2,
        name: name2,
        phone: phone2,
        state: state2,
        city: city2,
        price: price6,
      })
      .then((res) => {
        if (res.status === 204) {
          alert("Updated the Hospital");
          setname2("");
          setcity2("");
          setphone2("");
          setprice6("");
          setstate2("");
          setdcthsid2("");
        } else {
          alert("Error in updating Hospital");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleDeleteDH = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/api/v1/dcths/${dcthsid3}`, {
        params: { token, dcthsid: dcthsid3 },
      })
      .then((res) => {
        if (res.status === 204) {
          alert("deleted Hospital");
          setdcthsid3("");
        } else {
          alert("Error in deleting Hospital");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  if (!admin) {
    history.push("/adminlogin");
  }
  return (
    <div>
      <div className="md">
        <h3>Claims</h3>
        <div className="fr">
          <div className="left">
            <TextField
              placeholder="userid"
              value={userid1}
              onChange={(e) => {
                setuserid1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="dcthsid"
              value={dcthsid1}
              onChange={(e) => {
                setdcthsid1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price1}
              onChange={(e) => {
                setprice1(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleAddclaim(e)}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField
              placeholder="claimid"
              value={claimid1}
              onChange={(e) => {
                setclaimid1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price2}
              onChange={(e) => {
                setprice2(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleUpdateclaim(e)}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField
              placeholder="claimid"
              value={claimid2}
              onChange={(e) => {
                setclaimid2(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleDeleteclaim(e)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="md">
        <h3>Transactions</h3>
        <div className="fr">
          <div className="left">
            <TextField
              placeholder="userid"
              value={userid2}
              onChange={(e) => {
                setuserid2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price3}
              onChange={(e) => {
                setprice3(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleAddTr(e)}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField
              placeholder="transactionid"
              value={transactionid1}
              onChange={(e) => {
                settransactionid1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price4}
              onChange={(e) => {
                setprice4(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleUpdateTr(e)}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField
              placeholder="transactionid"
              value={transactionid2}
              onChange={(e) => {
                settransactionid2(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleDeleteTr(e)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="md">
        <h3>DctHs</h3>
        <div className="fr">
          <div className="left">
            <TextField
              placeholder="name"
              value={name1}
              onChange={(e) => {
                setname1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="phone"
              value={phone1}
              onChange={(e) => {
                setphone1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="state"
              value={state1}
              onChange={(e) => {
                setstate1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="city"
              value={city1}
              onChange={(e) => {
                setcity1(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price5}
              onChange={(e) => {
                setprice5(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleAddDH(e)}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField
              placeholder="dcthsid"
              value={dcthsid2}
              onChange={(e) => {
                setdcthsid2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="name"
              value={name2}
              onChange={(e) => {
                setname2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="phone"
              value={phone2}
              onChange={(e) => {
                setphone2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="state"
              value={state2}
              onChange={(e) => {
                setstate2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="city"
              value={city2}
              onChange={(e) => {
                setcity2(e.target.value);
              }}
            ></TextField>
            <TextField
              placeholder="price"
              value={price6}
              onChange={(e) => {
                setprice6(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleUpdateDH(e)}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField
              placeholder="dcthsid"
              value={dcthsid3}
              onChange={(e) => {
                setdcthsid3(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
              onClick={(e) => handleDeleteDH(e)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
