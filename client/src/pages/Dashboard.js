import React, {Component} from "react";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";
import API from "../utils/API";
import {BarChart, Legend} from 'react-easy-chart';
const Highcharts = require('highcharts');


class Dashboard extends Component {
  state = {
  };

  componentDidMount() {
    this.loadDashboard();
  }

  loadDashboard = () => {
    API.getData().then((resp)=>{this.setState(
      {client_name : resp.data.client_name, income: parseFloat(resp.data.monthly_income), job_title : resp.data.job_title}
      )
      console.log(resp.data.monthly_income);
    });

    const p1 = API.getFixedData().then((resp)=>{
      var totalCost = 0.0;
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.cost);
      });
      this.setState({fixedCost : totalCost || 0})
    });

    const p2 = API.getFlexData().then((resp)=>{
      var totalCost = 0.0;
      resp.data.forEach((value)=>{
        totalCost += parseFloat(value.cost);
      });
      this.setState({flexSpend : totalCost || 0})
    });

    const p3 = API.getGoalData().then((resp)=>{
      var goal = 0.0;
      resp.data.forEach((value)=>{
        goal += parseFloat(value.monthly_recurring);
      });
      this.setState({goals : goal})
    });
    Promise.all([p1, p2, p3]).then(values => {
      this.runCharts();
    }).catch((e) => {throw e});
  }

  runCharts = () => {

    Highcharts.chart('piechart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            innerSize:70,
            colorByPoint: true,
            data: [{
                name: 'Fixed Costs',
                y: parseInt(this.calcPercent(this.state.fixedCost,this.state.income))
            }, {
                name: 'Flexible Spendings',
                y: this.calcPercent(this.state.flexSpend,this.state.income)
            }, {
                name: 'Financial Goals',
                y: this.calcPercent(this.state.goals,this.state.income)
            }, {
                name: 'Savings',
                y: this.calcPercent(this.state.income - this.state.fixedCost - this.state.flexSpend -this.state.goals,this.state.income)
            }]
        }]
    });

    // Highcharts.setOptions({
    //   colors: Highcharts.map(Highcharts.getOptions().colors, (color)=>{
    //     return {
    //       radialGradient: {
    //         cx: 0.5,
    //         cy: 0.3,
    //         r: 0.7
    //       },
    //       stops: [
    //         [0, color],
    //         [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
    //       ]
    //     };
    //   })
    // });

    // console.log(Highcharts.getOptions().colors);

  }

  calcPercent = (cost,income) => {
    return cost / income * 100;
  }


  render(){
    function calcPercent(cost,income){
      return cost / income * 100;
    }
    const fixedPercentage = calcPercent(this.state.fixedCost,this.state.income);
    const flexPercentage = calcPercent(this.state.flexSpend,this.state.income);
    const goalsPercentage = calcPercent(this.state.goals,this.state.income);
    const savings = this.state.income - this.state.fixedCost - this.state.flexSpend -this.state.goals;
    const totalSavings = savings * 7 || 0;
    const savingsPercentage = calcPercent(savings,this.state.income);

    const config = [
      {color: '#D9534F'},
      {color: '#5BC0DE'},
      {color: '#F2B968'},
      {color: '#5CB85C'}
    ];

    return (
      <div>
        <Container>
          <Row>
            <Col size="md-12">

              <div className="col-xs-12">
                <h3 className='text-center'>Welcome to Up 2 Budget, Start Saving with the 50-20-30 Principle</h3>
                <h1>{this.state.client_name}</h1>
                <h4>{this.state.job_title}</h4>
              </div>
              <div id="piechart"></div>
              <div className="col-xs-12">
                <h3>Monthly Income: <b>${this.state.income || 0}</b></h3>
                <h3>Fixed Costs: <b>${this.state.fixedCost || 0}</b></h3>
                <h3>Flexible Spending: <b>${this.state.flexSpend || 0}</b></h3>
                <h3>Total Savings Till Date: <b>${totalSavings || 0}</b></h3>
                <h3>Financial Goals: <b>${parseInt(this.state.goals) || 0}</b></h3>
                <h3>Estimated Monthly Savings: <b>${parseInt(savings) || 0}</b></h3>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
