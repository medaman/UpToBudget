import React, { Component } from "react";
import API from "../utils/API";
import { Input, FormBtn, DropDownList } from "../components/Form";
import { Link } from "react-router-dom";

class Signup extends Component {
  state = {
    client_name:'',
    client_id:'',
    item_name:'',
    cost:'',
    items: []
  };

  // When the component mounts, load the next dog to be displayed
  componentDidMount() {
    this.loadFixedCosts();
  }

  // handleBtnClick = event => {
  //   // Get the data-value of the clicked button
  //   const btnType = event.target.attributes.getNamedItem("data-value").value;
  //   // Clone this.state to the newState object
  //   // We'll modify this object and use it to set our component's state
  //   const newState = { ...this.state };
  //
  //   if (btnType === "pick") {
  //     // Set newState.match to either true or false depending on whether or not the dog likes us (1/5 chance)
  //     newState.match = 1 === Math.floor(Math.random() * 5) + 1;
  //
  //     // Set newState.matchCount equal to its current value or its current value + 1 depending on whether the dog likes us
  //     newState.matchCount = newState.match
  //       ? newState.matchCount + 1
  //       : newState.matchCount;
  //   } else {
  //     // If we thumbs down'ed the dog, we haven't matched with it
  //     newState.match = false;
  //   }
  //   // Replace our component's state with newState, load the next dog image
  //   this.setState(newState);
  //   this.loadNextDog();
  // };

  loadFixedCosts = () => {
    API.getData().then((resp)=>{
      this.setState({income: parseFloat(resp.data.monthly_income),
                     client_id: resp.data.id,
                     client_name: resp.data.client_name}
                   );
    });
    API.getFixedData().then((resp)=>{
      var totalCost = 0.0;
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.cost);
      });
      this.setState({fixedCost : totalCost, items: resp.data})
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.rent &&
        this.state.utilities &&
        this.state.groceries &&
        this.state.other &&
        this.state.client_name &&
        this.state.savings &&
        this.state.income) {

      var tmpObj = {
        client_name : this.state.client_name,
        monthly_income : this.state.income,
        job_title : parseFloat(this.state.rent) +
                    parseFloat(this.state.utilities) +
                    parseFloat(this.state.groceries) +
                    parseFloat(this.state.other),
        current_savings : this.state.savings,
        id: 2
      }
      API.saveData(tmpObj).then((resp)=>{
        // console.log(resp);
        this.loadFixedCosts();
      }).catch((err)=>{throw err});
    }
  };

  handleClick(itemId, event){
    API.deleteFixedData(itemId).then((resp)=>{
      this.loadFixedCosts();
    }).catch((err)=>{
      throw err;
    })
  }

  render() {

    var fixedPercent = (this.state.fixedCost / this.state.income * 100).toFixed(2);
    return (

      // <p>Monthly Income: {this.state.income}</p>
      // <p>Total Fixed Cost: {this.state.fixedCost}</p>
      // <p>Fixed Cost Percentage: {fixedPercent}</p>
      <div>
        <h1>Signup</h1>
        <form>
            <label>Name</label>
            <Input
              value={this.state.client_name}
              onChange={this.handleInputChange}
              name="client_name"
              placeholder="Enter Name"
            />
            <label>How much is your monthly income?</label>
            <Input
              value={this.state.income}
              onChange={this.handleInputChange}
              name="income"
              placeholder="Enter amount"
            />
            <label>How much do you currently have saved?</label>
            <Input
              value={this.state.saved}
              onChange={this.handleInputChange}
              name="saved"
              placeholder="Enter amount"
            />
            <strong>How much do you generally spend per month on the following:</strong>
            <div Class="row">
              <div Class="col-md-3">
                <label>Rent</label>
                <Input
                  value={this.state.rent}
                  onChange={this.handleInputChange}
                  name="rent"
                  placeholder="Enter amount"
                />
              </div>
              <div Class="col-md-3">
                <label>Utilities</label>
                <Input
                  value={this.state.utilities}
                  onChange={this.handleInputChange}
                  name="utilities"
                  placeholder="Enter amount"
                />
              </div>
              <div Class="col-md-3"><label>Groceries</label>
                <Input
                  value={this.state.groceries}
                  onChange={this.handleInputChange}
                  name="groceries"
                  placeholder="Enter amount"
                />
              </div>
              <div Class="col-md-3"><label>Other Fixed Costs</label>
                <Input
                  value={this.state.other}
                  onChange={this.handleInputChange}
                  name="other"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <label>How much would you like to save each month?</label>
            <Input
              value={this.state.savings}
              onChange={this.handleInputChange}
              name="savings"
              placeholder="Enter amount"
            />
            <FormBtn
              disabled={!(this.state.client_name && this.state.savings && this.state.income)}
              onClick={this.handleFormSubmit}
            >
              Submit Fixed Cost Item
            </FormBtn>
          </form>
      </div>

    );
  }
}

export default Signup;
