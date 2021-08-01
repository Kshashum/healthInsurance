import { Button, TextField } from "@material-ui/core";
import React from "react";
import "./Admin.css";
const Admin = () => {
  return (
    <div>
      <div className="md">
        <h3>Claims</h3>
        <div className="fr">
          <div className="left">
            <TextField placeholder="userid"></TextField>
            <TextField placeholder="dcthsid"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField placeholder="claimid"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField placeholder="claimid"></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
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
            <TextField placeholder="userid"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField placeholder="transactionid"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField placeholder="transactionid"></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
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
            <TextField placeholder="name"></TextField>
            <TextField placeholder="phone"></TextField>
            <TextField placeholder="state"></TextField>
            <TextField placeholder="city"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Add
            </Button>
          </div>
          <div className="left">
            <TextField placeholder="dcthsid"></TextField>
            <TextField placeholder="name"></TextField>
            <TextField placeholder="phone"></TextField>
            <TextField placeholder="state"></TextField>
            <TextField placeholder="city"></TextField>
            <TextField placeholder="price"></TextField>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "5px" }}
            >
              Update
            </Button>
          </div>
          <div className="right">
            <TextField placeholder="dcthsid"></TextField>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "5px" }}
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
