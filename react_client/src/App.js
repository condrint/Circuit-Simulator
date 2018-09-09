import React, { Component } from 'react';
const axios = require('axios');
const { NodeInput } = require('./nodeinput')

class App extends Component {
  constructor(){
    super();
    this.state = {
      nodesCreated: false,
      simulating: false,
      ableToStopSimulating: false,
      numberOfNodes: '',

      resistorInputValue: '',
      resistorNode1InputValue: '0',
      resistorNode2InputValue: '0',

      powerSupplyInputValue: '',
      powerSupplyNode1InputValue: '0',
      powerSupplyNode2InputValue: '0',

      wireNode1InputValue: '0',
      wireNode2InputValue: '0',

      deleteNode1InputValue: '0',
      deleteNode2InputValue: '0',

      nodeDimensions: [],
      rowsOfNodesInput: '2', //default value for the drop down list
      colOfNodesInput: '2',
      
      edges: []
    }

    this.handleNodeSubmit = this.handleNodeSubmit.bind(this);
    this.handleResistorSubmit = this.handleResistorSubmit.bind(this);
    this.handlePowerSupplySubmit = this.handlePowerSupplySubmit.bind(this);
    this.handleWireSubmit = this.handleWireSubmit.bind(this);
    this.handleDeleteEdgesSubmit = this.handleDeleteEdgesSubmit.bind(this);
    this.handleResistorInputChange = this.handleResistorInputChange.bind(this);
    this.handleResistorNode1InputChange = this.handleResistorNode1InputChange.bind(this);
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
    this.checkIfEdgeExists = this.checkIfEdgeExists.bind(this);
  }

  //handle submits
  handleNodeSubmit(e){
    e.preventDefault();
    this.setState({
      nodeDimensions: [this.state.rowsOfNodesInput, this.state.colOfNodesInput],
      numberOfNodes: parseInt(this.state.rowsOfNodesInput, 10) * parseInt(this.state.colOfNodesInput, 10),
      nodesCreated: true,
      rowOfNodesInput: '',
      colOfNodesInput: ''
    })
  }
  
  checkIfEdgeExists(node1, node2){
    for (let edge of this.state.edges){
      if((edge[1] === node1 && edge[2] === node2) || (edge[1] === node2 && edge[2] === node1)){
        return true;
      }
    }
    return false;
  }

  handleResistorSubmit(e){
    e.preventDefault();
    let resistorValue = this.state.resistorInputValue;
    let node1 = this.state.resistorNode1InputValue;
    let node2 = this.state.resistorNode2InputValue;
    
    if (this.checkIfEdgeExists(node1, node2)){
      alert('Component already exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    if(!(resistorValue && (node1 || node1 === '0') && (node2 || node2 === '0'))){
      alert('Fields must not be empty.');
      return;
    }
    if (isNaN(resistorValue)){
      alert('Resistor value must be a valid integer.');
      return;
    }
    if (resistorValue === '0'){
      alert('Resistor value must not be zero.');
      return;
    }
    if (node1 === node2){
      alert('Cannot connect a node to itself.');
      return;
    }

    let curEdges = this.state.edges;
    curEdges.push('R' + node1 + node2 + resistorValue)
    this.setState({
      edges: curEdges,
      resistorInputValue: '',
      resistorNode1InputValue: 0,
      resistorNode2InputValue: 0
    })
    alert('Added component.');
    return;
  }

  handlePowerSupplySubmit(e){
    e.preventDefault();
    let voltsValue = this.state.powerSupplyInputValue;
    let node1 = this.state.powerSupplyNode1InputValue;
    let node2 = this.state.powerSupplyNode2InputValue;

    if (this.checkIfEdgeExists(node1, node2)){
      alert('Component already exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    if(!(voltsValue && (node1 || node1 === '0') && (node2 || node2 === '0'))){
      alert('Fields must not be empty');
      return;
    }
    if (isNaN(voltsValue)){
      alert('Resistor value must be a valid integer');
      return;
    }
    if (voltsValue === '0'){
      alert('Resistor value must not be zero');
      return;
    }
    if (node1 === node2){
      alert('Cannot connect a node to itself.');
      return;
    }
    let curEdges = this.state.edges;
    curEdges.push('P' + node1 + node2 + voltsValue)
    this.setState({
      edges: curEdges,
      powerSupplyInputValue: '',
      powerSupplyNode1InputValue: 0,
      powerSupplyNode2InputValue: 0
    })
    alert('Added component.');
    return;
  }
  handleWireSubmit(e){
    e.preventDefault();
  }
  handleDeleteEdgesSubmit(e){
    e.preventDefault();
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
    let edges = this.state.edges;
    return (
      <div className="App">
        <div id="inputContainer">
            <form onSubmit={this.handleNodeSubmit} id="nodeForm">
              <select name="rowlist" form="nodeForm" value={this.state.rowsOfNodesInput} onChange={this.handleRowChange} disabled={this.state.nodesCreated}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <select name="collist" form="nodeForm" value={this.state.colOfNodesInput} onChange={this.handleColChange} disabled={this.state.nodesCreated}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <input className="button" id="AddInput" type="submit" value="create nodes" disabled={this.state.nodesCreated}/>
            </form>
            <hr/>

            <NodeInput nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleResistorSubmit} type="resistor" placeholder="Ω" Node1InputValue={this.state.resistorNode1InputValue} Node2InputValue={this.state.resistorNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleResistorNode1InputChange} handleNode2InputChange={this.handleResistorNode2InputChange} InputValue={this.state.resistorInputValue} handleInputChange={this.handleResistorInputChange}/>
            <NodeInput nodesNumber={this.state.numberOfNodes} handleSubmit={this.handlePowerSupplySubmit} type="power supply" placeholder="V" Node1InputValue={this.state.powerSupplyNode1InputValue} Node2InputValue={this.state.powerSupplyNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handlePowerSupplyNode1InputChange} handleNode2InputChange={this.handlePowerSupplyNode2InputChange} InputValue={this.state.powerSupplyInputValue} handleInputChange={this.handlePowerSupplyInputChange}/>

            
            <form onSubmit={this.handleWireSubmit} disabled={this.state.nodesCreated}>
              <input className="nodeInput" type="text" name="firstNodeWireValue" placeholder="first node" value={this.state.wireNode1InputValue} onChange={this.handleWireNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="nodeInput" type="text" name="secondNodeWireValue" placeholder="second node" value={this.state.wireNode2InputValue} onChange={this.handleWireNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="create wire" disabled={!this.state.nodesCreated || this.state.simulating}/>
            </form>
            <hr/>
            <form onSubmit={this.handleDeleteEdgeSubmit} disabled={this.state.nodesCreated}>
              <input className="nodeInput" type="text" name="firstNodeValue" placeholder="first node" value={this.state.deleteNode1InputValue} onChange={this.handleDeleteNode1InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="nodeInput" type="text" name="secondNodeValue" placeholder="second node" value={this.state.deleteNode2InputValue} onChange={this.handleDeleteNode2InputChange} disabled={!this.state.nodesCreated || this.state.simulating}/>
              <input className="button" type="submit" value="delete component" disabled={!this.state.nodesCreated || this.state.simulating}/>
            </form>
            <hr/>
            <button type="button" onClick={this.simulate} disabled={!this.state.nodesCreated || this.state.simulating}>simulate</button>
            <button type="button" onClick={this.simulate} disabled={!this.state.ableToStopSimulating}>stop simulate</button>   
            <hr/>
        </div>
        <div>{edges}</div>
      </div>
    );
  }
}

export default App;
