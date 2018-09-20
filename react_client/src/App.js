import React, { Component } from 'react';
import title from './title.png'
const axios = require('axios');
const { NodeInput } = require('./nodeinput');
const { Circuit } = require('./circuit');



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
      
      edges: [],

      simulationResults: ''
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
    this.checkIfEdgeConnectsNeighbors = this.checkIfEdgeConnectsNeighbors.bind(this);
    this.stopSimulate = this.stopSimulate.bind(this);
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
  
  checkIfEdgeConnectsNeighbors(node1, node2){
    node1 = parseInt(node1, 10);
    node2 = parseInt(node2, 10);
    let rows = parseInt(this.state.nodeDimensions[0], 10);
    let cols = parseInt(this.state.nodeDimensions[1], 10);
    if(Math.floor(node1 / cols) === Math.floor(node2 / cols)){
      //same row
      return Math.abs(node1 - node2) === 1;
    }
    else if(node1 % cols === node2 % cols){
      //same col
      return Math.abs(Math.floor(node1 / cols) - Math.floor(node2 / cols)) === 1;
    }
    //diagonally related somehow
    return false; 
  }
  
  checkIfEdgeExists(node1, node2){
    for (let edge of this.state.edges){
      let splitEdge = edge.split('and');
      let node1_value = splitEdge[1].split('v');
      let node0FromEdge = splitEdge[0].slice(1);
      let node1FromEdge = node1_value[0];
      if((node0FromEdge === node1 && node1FromEdge === node2) || (node0FromEdge === node2 && node1FromEdge === node1)){
        return edge;
      }
    }
    return false;
  }

  handleResistorSubmit(e){
    e.preventDefault();
    let resistorValue = this.state.resistorInputValue;
    let node1 = this.state.resistorNode1InputValue;
    let node2 = this.state.resistorNode2InputValue;
    
    if (node1 === node2){
      //sendAlert('Cannot connect a node to itself.');
      alert('Cannot connect a node to itself.')
      return;
    }
    
    if (this.checkIfEdgeExists(node1, node2)){
      alert('Component already exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      alert('Nodes aren\'t adjacent.');
      return;
    }
    if(!(resistorValue)){
      alert('Fields must not be empty.');
      return;
    }
    if (isNaN(resistorValue)){
      alert('Resistor value must be a valid integer.');
      return;
    }
    if (parseInt(resistorValue, 10) <= 0 ){
      alert('Resistor value must be greater than zero.');
      return;
    }

    let curEdges = this.state.edges;
    curEdges.push('R' + node1 + 'and' + node2 + 'v' + resistorValue)
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
    
    if (node1 === node2){
      alert('Cannot connect a node to itself.');
      return;
    }
    if (this.checkIfEdgeExists(node1, node2)){
      alert('Component already exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      alert('Nodes aren\'t adjacent.');
      return;
    }
    if(!(voltsValue)){
      alert('Fields must not be empty');
      return;
    }
    if (isNaN(voltsValue)){
      alert('Volts value must be a valid integer');
      return;
    }
    if (voltsValue === '0'){
      alert('Volts value must not be zero');
      return;
    }
    let curEdges = this.state.edges;
    curEdges.push('P' + node1 + 'and' + node2 + 'v' + voltsValue)
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
    let node1 = this.state.wireNode1InputValue;
    let node2 = this.state.wireNode2InputValue;
    if (node1 === node2){
      alert('Cannot connect a node to itself.');
      return;
    }

    if (this.checkIfEdgeExists(node1, node2)){
      alert('Component already exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      alert('Nodes aren\'t adjacent.');
      return;
    }
  
    let curEdges = this.state.edges;
    curEdges.push('W' + node1 + 'and' + node2 + 'v')
    this.setState({
      edges: curEdges,
      wireNode1InputValue: 0,
      wireNode2InputValue: 0
    })
    alert('Added component.');
    return;
  }

  handleDeleteEdgesSubmit(e){
    e.preventDefault();
    let node1 = this.state.deleteNode1InputValue;
    let node2 = this.state.deleteNode2InputValue;
    let curEdges = [];
    let edgeToDelete = this.checkIfEdgeExists(node1, node2);
    if (edgeToDelete){
      curEdges = this.state.edges;
      curEdges.splice(curEdges.indexOf(edgeToDelete), 1);
    }
    else{
      alert('No component exists between ' + node1 + ' and ' + node2 + '.');
      return;
    }
    this.setState({
      edges: curEdges,
      deleteNode1InputValue: 0,
      deleteNode2InputValue: 0
    })
    alert('Deleted component.');
    return;
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
    if(this.state.edges.length === 0){
      alert('Components must be added to simulate.');
      return;
    }
    this.setState({
      simulating: true
    });
    let edges = this.state.edges;
    let nodes = this.state.numberOfNodes;
    axios.post('/api/simulate', {edges, nodes}).then(response => {
      this.setState({
        ableToStopSimulating: true,
        simulationResults: response.data
      });
    }).catch(error => {
      alert('Error simulating');
      this.setState({
        simulating: false
      })
    })
    
  }

  stopSimulate(){
    this.setState({ 
      simulating: false,
      ableToStopSimulating: false,
      simulationResults: ''
    })
  }

  render() {
    let edges = this.state.edges;
    let simulationResults = this.state.simulationResults;
    return (
      <div className="App">
        <img src={title} alt="Circuit Simulator"/>
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
              <NodeInput hasValue={true} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleResistorSubmit} type="create resistor" placeholder="Ω" Node1InputValue={this.state.resistorNode1InputValue} Node2InputValue={this.state.resistorNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleResistorNode1InputChange} handleNode2InputChange={this.handleResistorNode2InputChange} InputValue={this.state.resistorInputValue} handleInputChange={this.handleResistorInputChange}/>
              <NodeInput hasValue={true} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handlePowerSupplySubmit} type="create power supply" placeholder="V" Node1InputValue={this.state.powerSupplyNode1InputValue} Node2InputValue={this.state.powerSupplyNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handlePowerSupplyNode1InputChange} handleNode2InputChange={this.handlePowerSupplyNode2InputChange} InputValue={this.state.powerSupplyInputValue} handleInputChange={this.handlePowerSupplyInputChange}/>
              <NodeInput hasValue={false} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleWireSubmit} type="create wire" Node1InputValue={this.state.wireNode1InputValue} Node2InputValue={this.state.wireNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleWireNode1InputChange} handleNode2InputChange={this.handleWireNode2InputChange}/>
            <hr/>
              <NodeInput hasValue={false} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleDeleteEdgesSubmit} type="delete component" Node1InputValue={this.state.deleteNode1InputValue} Node2InputValue={this.state.deleteNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleDeleteNode1InputChange} handleNode2InputChange={this.handleDeleteNode2InputChange}/>
            <hr/>
              <button type="button" onClick={this.simulate} disabled={!this.state.nodesCreated || this.state.simulating}>simulate</button>
              <button type="button" onClick={this.stopSimulate} disabled={!this.state.ableToStopSimulating}>stop simulate</button>   
            <hr/>
        </div>
        <div>{edges}</div>
        <Circuit edges={this.state.edges} nodes={this.state.nodeDimensions} simulationResults={simulationResults}/>
      </div>
    );
  }
}

export default App;
