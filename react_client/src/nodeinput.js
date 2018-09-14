import React, { Component } from 'react';

class NodeInput extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let nodes = []
        for (let i = 0; i < this.props.nodesNumber; i++){
            let node = 'Node ' + i.toString();  
            nodes.push(node);
        }

        let value = ''
        if (this.props.hasValue){
            value = <input className="textInput" type="text"  placeholder={this.props.placeholder} value={this.props.InputValue} onChange={this.props.handleInputChange} disabled={!this.props.nodesCreated || this.props.simulating}/>
        }

        return(
        <form onSubmit={this.props.handleSubmit}>
            <select className="nodeInput" type="text" name={"firstNode" + this.props.type + "Value"} placeholder="first node" value={this.props.Node1InputValue} onChange={this.props.handleNode1InputChange} disabled={!this.props.nodesCreated || this.props.simulating}>
                { this.props.nodesNumber && nodes.map((item, index) => <option value={item} key={index}> {item} </option>) }
            </select>
            <select className="nodeInput" type="text" name={"secondNode" + this.props.type + "Value"} placeholder="second node" value={this.props.Node2InputValue} onChange={this.props.handleNode2InputChange} disabled={!this.props.nodesCreated || this.props.simulating}>
              { this.props.nodesNumber && nodes.map((item, index) => <option value={item} key={index}> {item} </option>) }
            </select>
            {value}
            <input className="button" type="submit" value={this.props.type} disabled={!this.props.nodesCreated || this.props.simulating}/>
        </form> 
        )
    }
}

export {NodeInput};