import React, { Component } from 'react';
const axios = require('axios');

class App extends Component {
  constructor(){
    super();
    this.state = {
      nodesCreated: false,
      simulating: false,
      ableToStopSimulating: false,
      resistorInputValue: '',
      resistorNode1InputValue: '',
      resistorNode2InputValue: '',
      powerSupplyInputValue: '',
      powerSupplyNode1InputValue: '',
      powerSupplyNode2InputValue: '',
      wireNode1InputValue: '',
      wireNode2InputValue: '',
      deleteNode1InputValue: '',
      deleteNode2InputValue: '',
      nodeDimensions: [],
      rowsOfNodesInput: '',
      colOfNodesInput: '',
      sessionID: '',
      edges: []
    }
    this.handleNodeSubmit = this.handleNodeSubmit.bind(this);
    this.handleResistorSubmit = this.handleResistorSubmit.bind(this);
    this.handlePowerSupplySubmit = this.handlePowerSupplySubmit.bind(this);
    this.handleWireSubmit = this.handleWireSubmit.bind(this);

    this.handleDeleteEdgesSubmit = this.handleDeleteEdgesSubmit.bind(this);
    this.handleResistorInputChange = this.handleResistorInputChange.bind(this);
    this.handleResistorNode2InputChange = this.handleResistorNode2InputChange.bind(this);
    this.handlePowerSupplyInputChange = this.handlePowerSupplyInputChange.bind(this);
    this.handlePowerSupplyNode1InputChange = this.handlePowerSupplyNode1InputChange.bind(this);
    this.handlePowerSupplyNode2InputChange = this.handlePowerSupplyNode2InputChange.bind(this);
    this.handleWireNode1InputChange = this.handleWireNode1InputChange.bind(this);
    this.handleWireNode2InputChange = this.handleWireNode2InputChange.bind(this);
    this.handleDeleteNode1InputChange = this.handleDeleteNode1InputChange.bind(this);
    this.handleDeleteNode2InputChange = this.handleDeleteNode2InputChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleColChange = this.handleColChange.bind(this);

    this.simulate = this.simulate.bind(this);
  }

  //handle submits
  handleNodeSubmit(e){

  }
  
  handleResistorSubmit(e){

  }
  handlePowerSupplySubmit(e){
    
  }
  handleWireSubmit(e){
    
  }
  handleDeleteEdgesSubmit(e){
    
  }

  //handle input changes
  handleResistorInputChange(e){this.setState({resistorInputValue: e.target.value});}
  handleResistorNode1InputChange(e){this.setState({resistorNode1InputValue: e.target.value});}
  handleResistorNode2InputChange(e){this.setState({resistorNode2InputValue: e.target.value});}

  handlePowerSupplyInputChange(e){this.setState({powerSupplyInputValue: e.target.value});}
  handlePowerSupplyNode1InputChange(e){this.setState({powerSupplyNode1InputValue: e.target.value});}
  handlePowerSupplyNode2InputChange(e){this.setState({powerSupplyNode2InputValue: e.target.value});}

  handleWireNode1InputChange(e){this.setState({wireNode1InputValue: e.target.value});}
  handleWireNode2InputChange(e){this.setState({wireNode2InputValue: e.target.value});}

  handleDeleteNode1InputChange(e){this.setState({deleteNode1InputValue: e.target.value});}
  handleDeleteNode2InputChange(e){this.setState({deleteNode2InputValue: e.target.value});}

  handleRowChange(e){this.setState({rowsOfNodesInput: e.target.value});}
  handleColChange(e){this.setState({colOfNodesInput: e.target.value});}

  simulate(){

  }

  render() {
    return (
      <div className="App">
        <div id="inputContainer">
            <form onSubmit={this.handleNodeSubmit} id="nodeForm">
              <select name="rowlist" form="nodeForm" value={this.state.rowsOfNodes} onChange={this.handleRowChange} disabled={this.state.nodesCreated}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <select name="collist" form="nodeForm" value={this.state.colOfNodes} onChange={this.handleColChange} disabled={this.state.nodesCreated}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <input className="button" id="AddInput" type="submit" value="create nodes"/>
            </form>
            <hr/>
            <form onSubmit={this.handleResistorSubmit}>
              <input className="textInput" type="text" name="firstNodeResistorValue" placeholder="first node" value={this.state.resistorNode1InputValue} onChange={this.handleResistorNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="secondNodeResistorValue" placeholder="second node" value={this.state.resistorNode2InputValue} onChange={this.handleResistorNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="resistorValue" placeholder="Ω" value={this.state.resistorInputValue} onChange={this.handleResistorInputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="create resistor" disabled={!this.state.nodesCreated}/>
            </form>
            <form onSubmit={this.handlePowerSupplySubmit} disabled={this.state.nodesCreated}>
              <input className="textInput" type="text" name="firstNodePowerSupplyValue" placeholder="first node" value={this.state.powerSupplyNode1InputValue} onChange={this.handlePowerSupplyNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="secondNodePowerSupplyValue" placeholder="second node" value={this.state.powerSupplyNode2InputValue} onChange={this.handlePowerSupplyNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="powerSupplyValue" placeholder="V" value={this.state.powerSupplyInputValue} onChange={this.handlePowerSupplyInputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="create powersupply" disabled={!this.state.nodesCreated || this.state.simulating}/>
            </form>
            <form onSubmit={this.handleWireSubmit} disabled={this.state.nodesCreated}>
              <input className="textInput" type="text" name="firstNodeWireValue" placeholder="first node" value={this.state.wireNode1InputValue} onChange={this.handleWireNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="secondNodeWireValue" placeholder="second node" value={this.state.wireNode2InputValue} onChange={this.handleWireNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="create wire" disabled={!this.state.nodesCreated || this.state.simulating}/>
            </form>
            <hr/>
            <form onSubmit={this.handleDeleteEdgeSubmit} disabled={this.state.nodesCreated}>
              <input className="textInput" type="text" name="firstNodeValue" placeholder="first node" value={this.state.deleteNode1InputValue} onChange={this.handleDeleteNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="textInput" type="text" name="secondNodeValue" placeholder="second node" value={this.state.deleteNode2InputValue} onChange={this.handleDeleteNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="delete component" disabled={!this.state.nodesCreated || this.state.simulating}/>
            </form>
            <hr/>
            <button type="button" onClick={this.simulate} disabled={!this.state.nodesCreated || this.state.simulating}>simulate</button>
            <button type="button" onClick={this.simulate} disabled={!this.state.ableToStopSimulating}>stop simulate</button>   
            <hr/>
        </div>
        <div>{this.state.edges}</div>
      </div>
    );
  }
}

export default App;
