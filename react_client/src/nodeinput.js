import React, { Component } from 'react';
import Drawer from 'react-motion-drawer';

class NodeInput extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let style = {
            "background":"#F9F9F9", 
            "boxShadow": "rgba(0, 0, 0, 0.188235) 0px 10px 20px, rgba(0, 0, 0, 0.227451) 0px 6px 6px"
        }

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
        <Drawer right open={this.props.open} drawerStyle={style} onChange={open => this.props.change(open)} panTolerance={100000000000000000} noTouchOpen={true} noTouchClose={true} overlayColor="rgba(0,0,0,0.1)">
            <form className="tabInput" onSubmit={this.props.handleSubmit}>
                <br/>
                <select className="nodeInput" type="text" name={"firstNode" + this.props.type + "Value"} placeholder="first node" value={this.props.Node1InputValue} onChange={this.props.handleNode1InputChange} disabled={!this.props.nodesCreated || this.props.simulating}>
                    { this.props.nodesNumber && nodes.map((item, index) => <option value={index} key={index}> {item} </option>) }
                </select>
                <br/>
                <select className="nodeInput" type="text" name={"secondNode" + this.props.type + "Value"} placeholder="second node" value={this.props.Node2InputValue} onChange={this.props.handleNode2InputChange} disabled={!this.props.nodesCreated || this.props.simulating}>
                  { this.props.nodesNumber && nodes.map((item, index) => <option value={index} key={index}> {item} </option>) }
                </select>
                <br/>
                {value}
                <br/>
                <input className="button addHoverCursor" type="submit" value={this.props.type} disabled={!this.props.nodesCreated || this.props.simulating}/>
            </form> 
        </Drawer>
        )
    }
}

export {NodeInput};