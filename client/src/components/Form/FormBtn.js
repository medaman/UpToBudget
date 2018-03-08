import React from "react";

export const FormBtn = props =>
  <button {...props} style={{ float: "right" }} className="btn btn-success" type='button'>
    {props.children}
  </button>;
