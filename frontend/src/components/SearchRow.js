import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useStateValue } from "../context/StateContext";

const SearchRow = (props) => {
  const { dcthsid, name, city, phone, state, price } = props;
  const [{ userid, token }, dispatch] = useStateValue();
  const handleAdd = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/visitlist/", {
        token,
        userid,
        dcthsid,
      })
      .then((res) => {
        if (res.status === 201) {
          dispatch({
            type: "ADD_VLIST",
            item: [dcthsid, name, city + state, phone],
          });
        }
      });
  };
  return (
    <tr>
      <td>{dcthsid}</td>
      <td>{name}</td>
      <td>{phone}</td>
      <td>{state}</td>
      <td>{city}</td>
      <td>{price}</td>
      <td>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => handleAdd(e)}
        >
          Add
        </Button>
      </td>
    </tr>
  );
};

export default SearchRow;
