import React, { Component } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import GoalListItems from "../components/GoalListItems";
import API from "../utils/API";
import { Input, FormBtn, DropDownList } from "../components/Form";
import { Link } from "react-router-dom";
import $ from 'jquery';
const Highcharts = require('highcharts');
const moment = require('moment');


class Goals extends Component {
  state = {
    item_name:'',
    cost:'',
    monthly_recurring:'',
    items: [],
  };

  // When the component mounts, load the next dog to be displayed
  componentDidMount() {
    this.loadGoals();
  }

  // handleBtnClick = event => {
  //   // Get the data-value of the clicked button
  //   const btnType = event.target.attributes.getNamedItem("data-value").value;
  //   // Clone this.state to the newState object
  //   // We'll modify this object and use it to set our component's state
  //   const newState = { ...this.state };``
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

  loadGoals = () => {
    const p1 = API.getData().then((resp)=>{
      this.setState({income: parseFloat(resp.data.monthly_income)});
    });
    const p2 = API.getGoalData().then((resp)=>{
      var totalCost = 0.0;
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.monthly_recurring);
      });
      this.setState({goals : totalCost, items: resp.data})
    });
    Promise.all([p1,p2]).then(values=>{
      this.runChart();
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
    if (this.state.cost && this.state.item_name && this.state.monthly_recurring) {
      var tmpObj = {
        cost : this.state.cost,
        item_name : this.state.item_name,
        monthly_recurring: this.state.monthly_recurring,
        total_invested: 0,
        clientId: 2
      }
      API.saveGoalData(tmpObj).then((resp)=>{
        console.log(resp);
        this.setState({
          cost : '',
          item_name:'',
          monthly_recurring:''
        })
        this.loadGoals();
      }).catch((err)=>{throw err});
    }
  };

  handleDeleteRequest(itemID, event){
    event.preventDefault();
    API.deleteGoalData(itemID).then((resp)=>{
      this.loadGoals();
    }).catch((err)=>{
      throw err;
    })
  }

  handleTransferRequest(itemID,event){
    event.preventDefault();
    this.state.items.forEach((resp)=>{
      if(resp.id === itemID){
        this.setState({
          transferName: resp.item_name,
          transferInvestedFunds: resp.total_invested,
          transferID: itemID
        })
      }
    });
  }

  handleTransferForm = event => {
    event.preventDefault();
    const selection = document.getElementById('transfer_list');
    const selectedItemID = selection.options[selection.selectedIndex].value;
    var selectedItem = {};
    var transferItem = {};
    this.state.items.forEach((resp,index)=>{
      console.log(resp.id);
      if(resp.id === parseInt(selectedItemID)){
        selectedItem = this.state.items[index];
      }else if (resp.id === parseInt(this.state.transferID)){
        transferItem = this.state.items[index]
      }
    })

    if (parseFloat(transferItem.total_invested) < parseFloat(this.state.transfer_amount)){
      console.log('Insufficient Funds');
      alert('Insufficient Funds!');
    }else {
      API.updateGoalData({
        clientId:2,
        id:selectedItem.id,
        total_invested:parseFloat(selectedItem.total_invested)+parseFloat(this.state.transfer_amount)
      }).then((resp)=>{}).catch((e)=>{throw e});

      API.updateGoalData({
        clientId:2,
        id:transferItem.id,
        total_invested:parseFloat(transferItem.total_invested)-parseFloat(this.state.transfer_amount)
      }).then((resp)=>{}).catch((e)=>{throw e});
      console.log('Sufficient Funds transfer_id:'+transferItem.id+', selectedItemID:' +selectedItemID);
      console.log(selectedItem);
      console.log(transferItem);
      this.loadGoals();
    }
    $('#exampleModal .close').click();
  }

  runChart = () => {
    var largestGoalLength = 0;
    this.state.items.forEach((resp)=>{
      if(largestGoalLength < parseInt(moment(resp.createdAt).startOf('Month').fromNow()) && !(moment(resp.createdAt).startOf('Month').fromNow()).includes('days') ){
        largestGoalLength = parseInt(moment(resp.createdAt).startOf('Month').fromNow());
      }
    });

    var monthArr = [];
    for (var i = largestGoalLength; i >= 0; i--){
      monthArr.push(moment().subtract(i,'month').format('MMMM'));
    };
    console.log(monthArr);

    var seriesArr = [];
    this.state.items.forEach((resp)=>{
      var length = ((moment(resp.createdAt).startOf('Month').fromNow()).includes('days')) ? 0 : parseInt(moment(resp.createdAt).startOf('Month').fromNow());
      if(isNaN(length)){
        length = 1;
      }
      // console.log(moment(resp.createdAt).startOf('Month').fromNow());
      // console.log(length);
      var tmpArr = [];
      for (var i = largestGoalLength+1; i > 0; i--){
        if (i <= length){
          tmpArr.push(parseInt(resp.total_invested)/(i));
        }else{
          tmpArr.push(0);
        }
      }
      var tmpObj = {
        name: resp.item_name,
        data: tmpArr
      };
      seriesArr.push(tmpObj);
    });
    console.log(seriesArr);

    Highcharts.chart('goalchart', {
      chart: {
          type: 'area'
      },
      title: {
          text: 'Goal Investments to Date'
      },
      xAxis: {
          categories: monthArr,
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      yAxis: {
          title: {
              text: '$ USD'
          },
          labels: {
              formatter: function () {
                  return this.value;
              }
          }
      },
      tooltip: {
        split: true,
        valueSuffix: '$ USD'
    },
      plotOptions: {
          area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                  lineWidth: 1,
                  lineColor: '#666666'
              }
          }
      },
      series: seriesArr
    });

  }


  render() {

    const goalPercent = (this.state.goals / this.state.income * 100).toFixed(2);

    return (

      // <p>Monthly Income: {this.state.income}</p>
      // <p>Total Fixed Cost: {this.state.fixedCost}</p>
      // <p>Fixed Cost Percentage: {fixedPercent}</p>
      <div>
        <h4>Financial Goal Percent: {goalPercent} of 20 %</h4>
        <div class="progress">
          <div className={(goalPercent >= 20 ) ? "progress-bar progress-bar-warning progress-bar-striped active" : "progress-bar progress-bar-success progress-bar-striped"} role="progressbar" aria-valuenow={goalPercent} aria-valuemin="0" aria-valuemax="100" style={{"width":parseInt((parseFloat(goalPercent)/20)*100)+'%'}}>
          </div>
        </div>
        <div className="col-xs-8">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SNo.</th>
                <th scope="col">Goal Name</th>
                <th scope="col">Goal Cost</th>
                <th scope="col">Monthly Recurring</th>
                <th scope="col">Total Invested</th>
                <th scope="col">Months Left</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.length ? (
                    this.state.items.map(item => {
                      return (
                        <tr>
                          <td>
                            <strong>{item.id}</strong>
                          </td>
                          <td>
                            <strong>
                              {item.item_name}
                            </strong>
                          </td>
                          <td>
                            <p>
                              ${parseFloat(item.cost).toFixed(2)}
                            </p>
                          </td>
                          <td>
                            <p>
                              ${item.monthly_recurring}
                            </p>
                          </td>
                          <td>
                            <p>
                              ${item.total_invested}
                            </p>
                          </td>
                          <td>
                            <p>
                              {((item.cost - item.total_invested)/item.monthly_recurring).toFixed(0)}
                            </p>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger" id={item.id}
                              onClick={(e) => this.handleDeleteRequest(item.id,e)}
                            >
                              Remove
                            </button>
                          </td>
                          <td>
                            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModal" id={item.id} onClick={(e) => this.handleTransferRequest(item.id,e)}>
                              Transfer
                            </button>
                          </td>
                        </tr>
                      )
                    })
              ) : (
                <h3>No Results to Display</h3>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-xs-4">
          <form>
            <label>Item Name</label>
            <Input
              value={this.state.item_name}
              onChange={this.handleInputChange}
              name="item_name"
              placeholder="Enter an item name"
            />
            <label>Item Cost</label>
            <Input
              value={this.state.cost}
              onChange={this.handleInputChange}
              name="cost"
              placeholder="Enter cost of item"
            />
            <label>Monthly Investment</label>
            <Input
              value={this.state.monthly_recurring}
              onChange={this.handleInputChange}
              name="monthly_recurring"
              placeholder="Enter monthly investment towards this goal"
            />
            <FormBtn
              disabled={!(this.state.cost && this.state.item_name && this.state.monthly_recurring)}
              onClick={this.handleFormSubmit}
            >
              Submit Goal Item
            </FormBtn>
          </form>
        </div>

        <div className='col-xs-12'>
          <div id="goalchart"></div>
        </div>

        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title text-center" id="exampleModalLabel">Transferring Invested Goal Funds</h3>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <h4>Goal : {this.state.transferName}</h4>
                <h4>Invested : ${this.state.transferInvestedFunds}</h4>
                <form>
                  <label>Transfer Amount</label>
                  <Input
                    value={this.state.transfer_amount}
                    onChange={this.handleInputChange}
                    name="transfer_amount"
                    placeholder="Enter amount to transfer"
                  />
                  <div>
                    <GoalListItems items={this.state.items} id={this.state.transferID}/>
                  </div>
                  <div Style="overflow: auto">
                    <FormBtn
                      disabled={!(this.state.transfer_amount)}
                      onClick={this.handleTransferForm}
                    >
                      Transfer Funds
                    </FormBtn>
                  </div>
                </form>

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

export default Goals;
