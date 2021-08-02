import React from "react";
import "./Landing.css";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <div>
      <div className="main background">
        <h1>The Health Insurance Company</h1>
        <p
          style={{
            marginTop: "10px",
            justifyContent: "center",
            marginBottom: "10px",
            fontSize: "18px",
          }}
        >
          We are a growing Company and offer a wide range of plans depending on
          your needs, Interested check out the plans below and signup
        </p>
        <div className="main2">
          <div className="card-deck">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Basic</h4>
                <ul className="card-text">
                  <li>CoInsurance PPO: 50%</li>
                  <li>Emergency Room Copay: 100$</li>
                  <li>Family Deductable: $700</li>
                  <li>Urgent Care Copay: $25</li>
                  <li>Individual Out of Pocket Maximum: $9000</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Premium</h4>
                <ul className="card-text">
                  <li>CoInsurance PPO: 65%</li>
                  <li>Emergency Room Copay: 150$</li>
                  <li>Family Deductable: $1200</li>
                  <li>Urgent Care Copay: $35</li>
                  <li>Individual Out of Pocket Maximum: $6000</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Premium Plus</h4>
                <li>CoInsurance PPO: 80%</li>
                <li>Emergency Room Copay: 180$</li>
                <li>Family Deductable: $1500</li>
                <li>Urgent Care Copay: $40</li>
                <li>Individual Out of Pocket Maximum: $5200</li>
              </div>
            </div>
          </div>
        </div>
        <Link to="/signup" style={{ marginTop: "10px" }}>
          <Button variant="contained" color="primary">
            Sign up
          </Button>
        </Link>
        <div
          className="card"
          style={{ marginTop: "30px", marginBottom: "5px" }}
        >
          <div className="card-body">
            <h4 className="card-title">More about our Goals</h4>
            <ul className="card-text">
              <li>Make Health Care as afforable as possible</li>
              <li>Customer obsession</li>
              <li>Make a Big Impact</li>
              <li>Be creative and Invent</li>
              <li>
                We’re committed to supporting our members, communities and
                healthcare workers in the wake of the novel coronavirus outbreak
              </li>
            </ul>
          </div>
        </div>
        <Link
          to="/adminlogin"
          style={{ marginTop: "10px", alignItems: "center" }}
        >
          <Button variant="contained">Admin</Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
