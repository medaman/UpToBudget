import React, { Component } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import API from "../utils/API";
import { Input, FormBtn, DropDownList } from "../components/Form";
import { Link } from "react-router-dom";
const Highcharts = require('highcharts');

class FlexSpend extends Component {
  state = {
    item_name:'',
    cost:'',
    items: []
  };

  // When the component mounts, load the next dog to be displayed
  componentDidMount() {
    this.loadFlexSpendings();
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

  loadFlexSpendings = () => {
    const p1 = API.getData().then((resp)=>{
      this.setState({income: parseFloat(resp.data.monthly_income)});
    });
    const p2 = API.getFlexData().then((resp)=>{
      var totalCost = 0.0;
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.cost);
      });
      this.setState({flexSpendings : totalCost, items: resp.data})
    });
    Promise.all([p1,p2]).then(values=>{
      this.runChart();
    }).catch((e)=>{throw e});
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.cost && this.state.item_name) {
      var tmpObj = {
        cost : this.state.cost,
        item_name : this.state.item_name,
        clientId: 2
      }
      API.saveFlexData(tmpObj).then((resp)=>{
        console.log(resp);
        this.setState({
          cost : '',
          item_name:''
        })
        this.loadFlexSpendings();
      }).catch((err)=>{throw err});
    }
  };

  handleClick(itemId, event){
    API.deleteFlexData(itemId).then((resp)=>{
      this.loadFlexSpendings();
    }).catch((err)=>{
      throw err;
    })
  }

  runChart = () => {
    // Highcharts.chart('linechart', {
    //     title: {
    //         text: 'Spending History'
    //     },
    //
    //     yAxis: {
    //         title: {
    //             text: '$ USD'
    //         }
    //     },
    //     legend: {
    //         layout: 'vertical',
    //         align: 'right',
    //         verticalAlign: 'middle'
    //     },
    //
    //     plotOptions: {
    //         series: {
    //             label: {
    //                 connectorAllowed: false
    //             },
    //             pointStart: 2016
    //         }
    //     },
    //
    //     series: [{
    //         name: 'Flexible Spendings',
    //         data: [125, 103, 77, 158, 71, 131, 233, 55]
    //     }],
    //
    //     responsive: {
    //         rules: [{
    //             condition: {
    //                 maxWidth: 500
    //             },
    //             chartOptions: {
    //                 legend: {
    //                     layout: 'horizontal',
    //                     align: 'center',
    //                     verticalAlign: 'bottom'
    //                 }
    //             }
    //         }]
    //     }
    //
    // });
    Highcharts.chart('linechart', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Spending History'
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '$ USD'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Flexible Spending History'
    },
    series: [{
        name: 'Population',
        data: [
            ['July', 356.5],
            ['August', 232.30],
            ['September', 186.7],
            ['November', 306.4],
            ['December', parseFloat(this.state.flexSpendings)]
        ],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});

  }

  render() {


    var flexPercent = (this.state.flexSpendings / this.state.income * 100).toFixed(2);
    return (

      // <p>Monthly Income: {this.state.income}</p>
      // <p>Total Fixed Cost: {this.state.fixedCost}</p>
      // <p>Fixed Cost Percentage: {fixedPercent}</p>
      <div>
        <h4>Flexible Spending Percent: {flexPercent} of 30 %</h4>
        <div class="progress">
          <div className={(flexPercent >= 30 ) ? "progress-bar progress-bar-warning progress-bar-striped active" : "progress-bar progress-bar-success progress-bar-striped"} role="progressbar" aria-valuenow={flexPercent} aria-valuemin="0" aria-valuemax="100" style={{"width":parseInt((parseFloat(flexPercent)/30)*100)+'%'}}>
            <span className="sr-only">40% Complete (success)</span>
          </div>
        </div>
        <div className="col-xs-7">
          <div id="linechart"></div>
        </div>
        <div className="col-xs-5">
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
            <FormBtn
              disabled={!(this.state.cost && this.state.item_name)}
              onClick={this.handleFormSubmit}
            >
              Submit Flexible Spending Item
            </FormBtn>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">SNo.</th>
                <th scope="col">Name of Item</th>
                <th scope="col">Amount</th>
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
                              ${item.cost}
                            </p>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger" id={item.id}
                              onClick={(e) => this.handleClick(item.id,e)}
                            >
                              Remove
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
    </div>

    );
  }
}

export default FlexSpend;
