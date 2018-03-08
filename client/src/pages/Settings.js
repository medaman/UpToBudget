import React, { Component } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import API from "../utils/API";
import { Input, FormBtn, DropDownList } from "../components/Form";
import { Link } from "react-router-dom";
import $ from 'jquery';

class Settings extends Component {
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
                     client_name: resp.data.client_name,
                     job_title: resp.data.job_title,
                     minimum_savings: resp.data.minimum_savings}
                   );
    });
    API.getFixedData().then((resp)=>{
      var totalCost = 0.0;
      var tmpObj = {};
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.cost);
        var id_name = value.item_name  + '_id'
        this.setState({
          [value.item_name] : value.cost,
          [id_name] : value.id
        });
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
        this.state.minimum_savings &&
        this.state.income) {

      var tmpObj = {
        id:2,
        client_name : this.state.client_name,
        monthly_income : this.state.income,
        job_title : this.state.job_title,
        minimum_savings : this.state.minimum_savings
      };
      var fixedCostArr = [
        {
          name: 'rent',
          cost: parseFloat(this.state.rent)
        },
        {
          name: 'utilities',
          cost: parseFloat(this.state.utilities)
        },
        {
          name: 'groceries',
          cost: parseFloat(this.state.groceries)
        },
        {
          name: 'other',
          cost: parseFloat(this.state.other)
        }
      ];

      fixedCostArr.forEach((resp)=>{
        var id_name = resp.name + '_id';
        var tmpFixedObj = {
          cost : resp.cost,
          item_name : resp.name,
          clientId: 2,
          id:this.state[id_name]
        }
        API.updateFixedData(tmpFixedObj).catch(e => {throw e});
      });

      API.saveData(tmpObj).then((resp)=>{
      }).catch((err)=>{throw err});
      // alert('Your settings have been updated ' + this.state.client_name + '!')
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

    // var fixedPercent = (this.state.fixedCost / this.state.income * 100).toFixed(2);
    return (

      // <p>Monthly Income: {this.state.income}</p>
      // <p>Total Fixed Cost: {this.state.fixedCost}</p>
      // <p>Fixed Cost Percentage: {fixedPercent}</p>
      <div>
        <h1>Settings</h1>
        <form>
            <label>Name</label>
            <Input
              value={this.state.client_name}
              onChange={this.handleInputChange}
              name="client_name"
              placeholder="Enter Name"
            />
            <label>Job Title</label>
            <Input
              value={this.state.job_title}
              onChange={this.handleInputChange}
              name="job_title"
              placeholder="Enter Job Title"
            />
            <label>Monthly Income After Taxes:</label>
            <Input
              value={this.state.income}
              onChange={this.handleInputChange}
              name="income"
              placeholder="Enter amount"
            />
            <strong>Your Monthly Recurring Costs:</strong>
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
            <label>Minimum amount you like to save per month:</label>
            <Input
              value={this.state.minimum_savings}
              onChange={this.handleInputChange}
              name="minimum_savings"
              placeholder="Enter amount"
            />
            <FormBtn data-toggle="modal" data-target="#updateModal"
              disabled={!(this.state.client_name && this.state.minimum_savings && this.state.income)}
              onClick={this.handleFormSubmit}
            >
              Change Profile
            </FormBtn>
          </form>

          <div className="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title text-center" id="exampleModalLabel">Settings</h3>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">

                  <h4>Your settings have been updated!</h4>


                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

      </div>

    );
  }
}

export default Settings;
