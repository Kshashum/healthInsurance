import React from "react";

const AccountRow = (props) => {
  const { date, price } = props;
  return (
    <tr>
      <td>{date}</td>
      <td>${price}</td>
    </tr>
  );
};

export default AccountRow;
