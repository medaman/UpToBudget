import axios from "axios";

// Export an object containing methods we'll use for accessing the Dog.Ceo API

export default {
  getData: function() {
    return axios.get('/api/client');
  },
  getFixedData: function() {
    return axios.get('/api/fixedcost');
  },
  getFlexData: function() {
    return axios.get('/api/flexspend');
  },
  getGoalData: function() {
    return axios.get('/api/goal');
  },
  updateGoalData: function(data) {
    return axios.put('/api/goal',data);
  },
  updateFixedData: function(fixedCostData) {
    return axios.put("/api/fixedcost", fixedCostData);
  },
  // Saves data to the database
  saveData: function(data) {
    return axios.put('/api/client', data);
  },
  saveFixedData: function(fixedCostData) {
    return axios.post("/api/fixedcost", fixedCostData);
  },
  saveFlexData: function(flexData) {
    return axios.post("/api/flexspend", flexData);
  },
  saveGoalData: function(goalData) {
    return axios.post("/api/goal", goalData);
  },
  // Saves data to the database
  deleteFixedData: function(itemId) {
    return axios.delete("/api/fixedcost", { params : { id : itemId }});
  },
  deleteFlexData: function(itemId) {
    return axios.delete("/api/flexspend", { params : { id : itemId }});
  },
  deleteGoalData: function(itemId) {
    return axios.delete("/api/goal", { params : { id : itemId }});
  }
};
