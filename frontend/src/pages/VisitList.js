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
    if (login) {
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
    }
  }, []);
  const mapper = (item) => {
    return (
      <VRow
        key={item[0]}
        dcthsid={item[1]}
        name={item[6]}
        address={item[8] + " " + item[9]}
        phone={item[7]}
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
            <th>DctHsid</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visitlist.length > 0 ? (
            visitlist
          ) : (
            <tr>
              <td colSpan="6">There are no items in visitlist</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default VisitList;
