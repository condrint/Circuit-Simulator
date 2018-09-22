import React, { Component } from 'react';
import title from './title.png';
import resistor from './resistor.png';
import wire from './wire.png';
import power from './power.png';
import erase from './erase.png';
import sim from './sim.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const axios = require('axios');
const { NodeInput } = require('./nodeinput');
const { Circuit } = require('./circuit');

class App extends Component {
  constructor(){
    super();
    this.state = {
      nodesCreated: true,
      simulating: false,
      ableToStopSimulating: false,
      numberOfNodes: 28,

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

      nodeDimensions: [4, 7],
      
      edges: [],

      simulationResults: '',

      resistorDrawer: false,
      powerDrawer: false,
      wireDrawer: false,
      deleteDrawer: false,
      resNum: 0,
      powNum: 0,
      wireNum: 0,
      delNum: 0,

      hover: null,
      first: true
    }

    //this.handleNodeSubmit = this.handleNodeSubmit.bind(this);
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
    this.simulate = this.simulate.bind(this);
    this.checkIfEdgeExists = this.checkIfEdgeExists.bind(this);
    this.checkIfEdgeConnectsNeighbors = this.checkIfEdgeConnectsNeighbors.bind(this);
    this.openResistorTab = this.openResistorTab.bind(this);
    this.openPowerTab = this.openPowerTab.bind(this);
    this.openWireTab = this.openWireTab.bind(this);
    this.openDeleteTab = this.openDeleteTab.bind(this);
    this.resistorChange = this.resistorChange.bind(this);
    this.wireChange = this.wireChange.bind(this);
    this.powerChange = this.powerChange.bind(this);
    this.deleteChange = this.deleteChange.bind(this);
    this.hoverNode = this.hoverNode.bind(this);
  }
  hoverNode(val){
    this.setState({
      hover:val
    })
    console.log(val);
  }
  resistorChange(val){
    this.setState({
      resistorDrawer: val
    })
  }

  wireChange(val){
    this.setState({
      wireDrawer: val
    })
  }

  powerChange(val){
    this.setState({
      powerDrawer: val
    })
  }
  
  deleteChange(val){
    this.setState({
      deleteDrawer: val
    })
  }

  openDeleteTab(){
    let val = this.state.deleteDrawer;
    this.setState({
      deleteDrawer: !val,
      resistorDrawer: false,
      powerDrawer: false,
      wireDrawer: false,
    })
  }

  openPowerTab(){
    let val = this.state.powerDrawer;
    this.setState({
      powerDrawer: !val,
      resistorDrawer: false,
      wireDrawer: false,
      deleteDrawer: false
    })
  }

  openResistorTab(){
    let val = this.state.resistorDrawer;
    this.setState({
      resistorDrawer: !val,
      powerDrawer: false,
      wireDrawer: false,
      deleteDrawer: false
    })
  }

  openWireTab(){
    let val = this.state.wireDrawer;
    this.setState({
      wireDrawer: !val,
      resistorDrawer: false,
      powerDrawer: false,
      deleteDrawer: false
    })
  }
  
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
      toast('Cannot connect a node to itself.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (this.checkIfEdgeExists(node1, node2)){
      toast('Component already exists between ' + node1 + ' and ' + node2 + '.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      toast('Nodes aren\'t adjacent.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if(!(resistorValue)){
      toast('Fields must not be empty.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (isNaN(resistorValue)){
      toast('Resistor value must be a valid nonzero integer.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (parseInt(resistorValue, 10) <= 0 ){
      toast('Resistor value must be a valid nonzero integer.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
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
    toast('Added component.', {
      position: toast.POSITION.BOTTOM_LEFT,
      hideProgressBar: true
    });
    this.setState({
      resistorDrawer: false
    })
    return;
  }

  handlePowerSupplySubmit(e){
    e.preventDefault();
    let voltsValue = this.state.powerSupplyInputValue;
    let node1 = this.state.powerSupplyNode1InputValue;
    let node2 = this.state.powerSupplyNode2InputValue;
    
    if (node1 === node2){
      toast('Cannot connect a node to itself.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (this.checkIfEdgeExists(node1, node2)){
      toast('Component already exists between ' + node1 + ' and ' + node2 + '.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      toast('Nodes aren\'t adjacent.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if(!(voltsValue)){
      toast('Fields must not be empty.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (isNaN(voltsValue)){
      toast('Resistor value must be a valid nonzero integer.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (parseInt(voltsValue, 10) <= 0 ){
      toast('Resistor value must be a valid nonzero integer.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
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

    toast('Added component.', {
      position: toast.POSITION.BOTTOM_LEFT,
      hideProgressBar: true
    });
    this.setState({
      powerDrawer: false
    })
    return;
  }

  handleWireSubmit(e){
    e.preventDefault();
    let node1 = this.state.wireNode1InputValue;
    let node2 = this.state.wireNode2InputValue;

    
    if (node1 === node2){
      toast('Cannot connect a node to itself.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (this.checkIfEdgeExists(node1, node2)){
      toast('Component already exists between ' + node1 + ' and ' + node2 + '.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if (!this.checkIfEdgeConnectsNeighbors(node1, node2)){
      toast('Nodes aren\'t adjacent.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    let curEdges = this.state.edges;
    curEdges.push('W' + node1 + 'and' + node2 + 'v')
    this.setState({
      edges: curEdges,
      wireNode1InputValue: 0,
      wireNode2InputValue: 0
    })
    toast('Added component.', {
      position: toast.POSITION.BOTTOM_LEFT,
      hideProgressBar: true
    });
    this.setState({
      wireDrawer: false
    })
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
      toast('No component exists between ' + node1 + ' and ' + node2 + '.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    this.setState({
      edges: curEdges,
      deleteNode1InputValue: 0,
      deleteNode2InputValue: 0
    })
    toast('Deleted component.', {
      position: toast.POSITION.BOTTOM_LEFT,
      hideProgressBar: true
    });
    this.setState({
      deleteDrawer: false
    })
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
      toast('Components must be added to simulate.', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      return;
    }
    if(this.state.simulating){
      this.setState({ 
        simulating: false,
        ableToStopSimulating: false,
        simulationResults: ''
      });
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
      toast('Hover over a node to see the results!', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "green"
      });
    }).catch(error => {
      toast('Error simulating: ' + error.toString(), {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true,
        bodyClassName: "red"
      });
      this.setState({
        simulating: false
      })
    })
    
  }

  

  render() {
    let simulationResults = this.state.simulationResults;
    if(this.state.first){
      this.setState({first:false});
      toast('Hover over a node to see which one it is!', {
        position: toast.POSITION.BOTTOM_LEFT,
        hideProgressBar: true
      });
    }
    return (
      <div className="App">
        <div className="header" >
          <img src={title} alt="Circuit Simulator"/>
          <div className="header" id="inputContainer">
            <img className="addHoverCursor" src={resistor} height="75" width="75" onClick={this.openResistorTab} alt="Add resistor"/>
            <img className="addHoverCursor" src={power} height="75" width="75" onClick={this.openPowerTab} alt="Add Power Supply"/>
            <img className="addHoverCursor" src={wire} height="75" width="75" onClick={this.openWireTab} alt="Add Wire"/>
            <img className="addHoverCursor" src={sim} height="75" width="75" onClick={this.simulate} alt="Simulate Circuit" style={this.state.simulating && {"opacity":".5"} || {}}/>
            <img className="addHoverCursor" src={erase} height="60" width="60" onClick={this.openDeleteTab} alt="Add Delete" id="raiseme"/>
            <NodeInput change={this.resistorChange} open={this.state.resistorDrawer} hasValue={true} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleResistorSubmit} type="create resistor" placeholder="Ω" Node1InputValue={this.state.resistorNode1InputValue} Node2InputValue={this.state.resistorNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleResistorNode1InputChange} handleNode2InputChange={this.handleResistorNode2InputChange} InputValue={this.state.resistorInputValue} handleInputChange={this.handleResistorInputChange}/>
            <NodeInput change={this.powerChange} open={this.state.powerDrawer} hasValue={true} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handlePowerSupplySubmit} type="create power supply" placeholder="V" Node1InputValue={this.state.powerSupplyNode1InputValue} Node2InputValue={this.state.powerSupplyNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handlePowerSupplyNode1InputChange} handleNode2InputChange={this.handlePowerSupplyNode2InputChange} InputValue={this.state.powerSupplyInputValue} handleInputChange={this.handlePowerSupplyInputChange}/>
            <NodeInput change={this.wireChange} open={this.state.wireDrawer} hasValue={false} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleWireSubmit} type="create wire" Node1InputValue={this.state.wireNode1InputValue} Node2InputValue={this.state.wireNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleWireNode1InputChange} handleNode2InputChange={this.handleWireNode2InputChange}/>
            <NodeInput change={this.deleteChange}open={this.state.deleteDrawer} hasValue={false} nodesNumber={this.state.numberOfNodes} handleSubmit={this.handleDeleteEdgesSubmit} type="delete component" Node1InputValue={this.state.deleteNode1InputValue} Node2InputValue={this.state.deleteNode2InputValue} nodesCreated={this.state.nodesCreated} simulating={this.state.simulating} handleNode1InputChange={this.handleDeleteNode1InputChange} handleNode2InputChange={this.handleDeleteNode2InputChange}/>
          </div>
        </div>
        <div className="main">
          <Circuit edges={this.state.edges} nodes={this.state.nodeDimensions} simulationResults={simulationResults}/>
        </div>
        <br/>
        <ToastContainer />
        <br/>
      </div>
    );
  }
}

export default App;
