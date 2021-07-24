import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useStateValue } from "../context/StateContext";

const VRow = (props) => {
  const { dcthsid, name, address, phone, time, vlistid } = props;
  const [{ userid, token }, dispatch] = useStateValue();
  const handleDelete = async (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:5000/api/v1/visitlist/delete", {
        params: { token, userid, dcthsid },
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: "REMOVEVLIST",
            item: vlistid,
          });
        }
      });
  };
  return (
    <tr>
      <td>{dcthsid}</td>
      <td>{name}</td>
      <td>{address}</td>
      <td>{phone}</td>
      <td>{time}</td>
      <td>
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => handleDelete(e)}
        >
          Remove
        </Button>
      </td>
    </tr>
  );
};

export default VRow;
