import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import FixedCost from "./pages/FixedCost";
import FlexSpend from "./pages/FlexSpend";
import Goals from "./pages/Goals";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Wrapper from "./components/Wrapper";
import API from "./utils/API";

class App extends Component {
  state = {
  }
  componentDidMount() {
      this.loadAPP();

  }
  loadAPP = () => {
    // API.getData().then((resp)=>{
    //   this.setState({income: parseFloat(resp.data.monthly_income)});
    // });
    // API.getFixedData().then((resp)=>{
    //   var totalCost = 0.0;
    //   resp.data.forEach((value)=>{
    //     totalCost += parseFloat(value.cost);
    //   });
    //   this.setState({fixedCost : totalCost, items: resp.data})
    // });
    // API.getData().then((resp)=>{this.setState(
    //   {client_name : resp.data.client_name, income: parseFloat(resp.data.monthly_income),'client_id':resp.data.id}
    //   )
    //   console.log(resp.data.id);
    // });
  };
    render() {
    return(
      <Router>
        <div className = "container">
          <Navbar />
          <Wrapper>
            <Route exact path="/" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            {/* <Route exact path="/fixedcost" component={FixedCost} /> */}
            <Route exact path="/flexspend" component={FlexSpend} />
            <Route exact path="/goal" component={Goals} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/settings" component={Settings} />
          </Wrapper>
          <Footer />
        </div>
      </Router>
    )
  }
}
export default App;
