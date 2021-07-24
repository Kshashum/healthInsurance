import React, { useEffect } from "react";
import { useStateValue } from "../context/StateContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./VisitList.css";
import VRow from "../components/VRow";
const VisitList = () => {
  const history = useHistory();
  const [{ login, vlist, token, userid }, dispatch] = useStateValue();
  if (!login) {
    history.push("/login");
  }
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/visitlist", {
        params: { token, userid },
      })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data.vlist) {
          dispatch({
            type: "VLIST",
            item: data.vlist,
          });
        } else {
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const mapper = (item) => {
    return (
      <VRow
        dcthsid={item[1]}
        name={item[5]}
        address={item[7] + " " + item[8]}
        phone={item[6]}
        time={item[3]}
        vlistid={item[0]}
      />
    );
  };
  const visitlist = vlist.map((item) => mapper(item));
  return (
    <div className="main">
      <h3>Visit List</h3>
      <table
        class="table table-striped tb"
        style={{ marginTop: "1%", backgroundColor: "white" }}
      >
        <thead>
          <tr>
            <th scope="col">DctHsid</th>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Phone</th>
            <th scope="col">Time</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {visitlist.length > 0 ? (
            visitlist
          ) : (
            <tr>
              <td colspan="3">There are no items in visitlist</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default VisitList;
