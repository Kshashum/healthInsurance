import React from "react";

const ClaimRow = (props) => {
  const { claimid, dcthsid, price } = props;
  return (
    <tr>
      <td>{claimid}</td>
      <td>{dcthsid}</td>
      <td>{price}</td>
    </tr>
  );
};

export default ClaimRow;
