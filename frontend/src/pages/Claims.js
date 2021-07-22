import React, { useEffect } from "react";
import ClaimRow from "../components/ClaimRow";
import { useStateValue } from "../context/StateContext";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Claims = () => {
  const history = useHistory();
  const [{ claimlist, token }, dispatch] = useStateValue();
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/claims", { token })
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
  });
  const mapper = (item) => {
    return (
      <ClaimRow
        claimid={item.claimid}
        dcthsid={item.dcthsid}
        price={item.price}
      />
    );
  };
  const claims = claimlist.map((item) => mapper(item));
  return (
    <div className="main">
      <h3>My Claims</h3>
      <table
        class="table table-striped"
        style={{ marginTop: "1%", backgroundColor: "white" }}
      >
        <thead>
          <tr>
            <th scope="col">Claim Id</th>
            <th scope="col">{`Doctor & Hospital Id`}</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {claims.length > 0 ? (
            claims
          ) : (
            <p style={{ alignItems: "center" }}>There are no claims</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Claims;
