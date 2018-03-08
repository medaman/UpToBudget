import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

// Depending on the current path, this component sets the "active" class on the appropriate navigation link item
const Navbar = props =>
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/dashboard">
          <img src="logo.png" height="20"/>
        </Link>
      </div>
      <ul className="nav navbar-nav">
        <li
          className={
            window.location.pathname === "/dashboard"
              ? "active"
              : ""
          }
        >
          <Link to="/dashboard">Dashboard</Link>
        </li>
        {/* <li
          className={window.location.pathname === "/fixedcost" ? "active" : ""}
        >
          <Link to="/fixedcost">Fixed Costs</Link>
        </li> */}
        <li
          className={window.location.pathname === "/flexspend" ? "active" : ""}
        >
          <Link to="/flexspend">Flexible Spendings</Link>
        </li>
        <li
          className={window.location.pathname === "/goal" ? "active" : ""}
        >
          <Link to="/goal">Financial Goals</Link>
        </li>
        <li
          className={window.location.pathname === "/settings" ? "active" : ""}
        >
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  </nav>;

export default Navbar;
