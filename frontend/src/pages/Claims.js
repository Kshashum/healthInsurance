import React, { useEffect } from "react";
import ClaimRow from "../components/ClaimRow";
import { useStateValue } from "../context/StateContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Claims.css";

const Claims = () => {
  const history = useHistory();
  const [{ login, claimlist, token, userid }, dispatch] = useStateValue();
  if (!login) {
    history.push("/login");
  }
  useEffect(() => {
    if (login) {
      axios
        .get("http://localhost:5000/api/v1/claims", {
          params: { token, userid },
        })
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          if (data.claims) {
            dispatch({
              type: "CLAIMS",
              item: data.claims,
            });
          } else {
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);
  const mapper = (item) => {
    return (
      <ClaimRow
        key={item[0]}
        claimid={item[0]}
        dcthsid={item[2]}
        price={item[3]}
      />
    );
  };
  const claims = claimlist.map((item) => mapper(item));
  return (
    <div className="main">
      <h3>My Claims</h3>
      <table
        className="table table-striped tb"
        style={{ marginTop: "1%", backgroundColor: "white" }}
      >
        <thead>
          <tr>
            <th>Claim Id</th>
            <th>{`Doctor & Hospital Id`}</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {claims.length > 0 ? (
            claims
          ) : (
            <tr>
              <td colSpan="3">There are no claims</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Claims;
