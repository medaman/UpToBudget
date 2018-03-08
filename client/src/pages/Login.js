import React from "react";
import Hero from "../components/Hero";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";
import API from "../utils/API";

const About = () =>
  <div>
    <div className="col-sm-offset-4 col-sm-4">
      <div className="card">
        <div className="header text-center">
          <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
          <h3>Welcome to Up 2 Budget</h3>
          <p>&nbsp;</p>
          <img src="logo.png"/>
          <p>&nbsp;</p><p>&nbsp;</p>
          <p>Please Log In.</p>
          <a href="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google</a>
        </div>
      </div>
    </div>
  </div>;

export default About;
