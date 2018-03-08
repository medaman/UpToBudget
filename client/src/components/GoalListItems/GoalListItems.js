import React from "react";
import "./GoalListItems.css";

const GoalListItems = props =>{

return (
  <div className="form-group">
    <label for="transfer_list">Select Item to Transfer Funds to:</label>
    <select className="form-control" id="transfer_list">
      {props.items.map(item => (
        (props.id !== item.id) ?
        <option value ={item.id}>
          {item.item_name}
        </option>:<br/>

      ))}
    </select>
  </div>
  );
}

export default GoalListItems;
