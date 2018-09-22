import React, { Component } from 'react';

class Circuit extends Component{
    constructor(props){
        super(props);
    
    }
    render() {
        let edges = this.props.edges;
        let nodes = this.props.nodes;
        let rows = 0;
        let cols = 0;
        if (nodes){
            rows = nodes[0];
            cols = nodes[1];
        }
        let circuit = [];
        const blankSpot = '\t\n\t\n\t'
        const nodeSpot = '\t\n  o  \n\t'
        let simResults = this.props.simulationResults;
        //create blank circuit and place nodes
        for(let i = 0; i < 2 * rows - 1; i++){
            let newRow = []
            if (i % 2 == 0){
                for(let j = 0; j < 2 * cols - 1; j++){
                    if (j % 2 == 0){
                        let nodalVoltage = '';
                        let nodeNumber = ((i / 2 * cols) + (j % (cols * 2 - 1)) / 2).toString();
                        let hadSim = false;

                        //if nodal voltage exists, render it as title at node
                        if (simResults.hasOwnProperty(nodeNumber.toString())){
                            nodalVoltage = ', ' + parseFloat(simResults[nodeNumber.toString()], 10).toPrecision(4).toString() + 'V'
                            hadSim = true;
                        }
                        newRow.push([nodeSpot, 'node' + nodeNumber + nodalVoltage, hadSim]);
                    }
                    else{
                        newRow.push([blankSpot, 'Empty']);
                    }
                }
            }
            else{
                for(let j = 0; j < 2 * cols - 1; j++){
                    newRow.push([blankSpot, 'Empty']);
                }
            } //blank spot for resistance/voltage for resistors/power supplies
            circuit.push(newRow);
        }

        //place edges
        if (rows && cols){
            for (let edge of edges){
                //string manipulation to get data from edges
                let splitEdge = edge.split('and');
                let type_node0 = splitEdge[0]
                let node1_value = splitEdge[1].split('v');
                let nodeType = splitEdge[0].slice(0, 1);
                let node0 = parseInt(splitEdge[0].slice(1), 10);
                let node1 = parseInt(node1_value[0], 10);
                let value = parseInt(node1_value[1], 10);
                let hadSim = false;

                let rowToPlaceEdge = 0;
                let colToPlaceEdge = 0;

                //find if nodes are in same row or same column (this condition is enforced in app.js)
                if (Math.floor(node0 / cols) == Math.floor(node1 / cols)){
                    //same row
                    rowToPlaceEdge = 2 * (Math.floor(node0 / cols)); //node1 would work find too
                    colToPlaceEdge = (node0 % cols) + (node1 % cols);
                    
                   
                    let spot = '\t\n----' + nodeType + '----\n\t';
                    
                    //node0 is positive terminal 
                    if(nodeType == 'P'){
                        if (node0 > node1){
                            spot = '-\t+\n----' + nodeType + '----\n\t';
                        }
                        else{
                            spot = '+\t-\n----' + nodeType + '----\n\t';
                        }
                    }
                    
                    let spotValue = '';
                    if (value){
                        if(nodeType == 'R'){
                            spotValue = value + 'Ω';
                        }
                        else if(nodeType == 'P'){
                            spotValue = value + 'V';
                        }
                    }

                    //check for current in simresults
                    let nodes = node0.toString() + 'and' + node1.toString();
                    if (simResults.hasOwnProperty(nodes)){
                        spotValue += '\n' + parseFloat(simResults[nodes], 10).toPrecision(4).toString() + 'A'
                        hadSim = true;
                    }
                    circuit[rowToPlaceEdge][colToPlaceEdge] = [spot, spotValue, hadSim];
                    
                }
                else{
                    //same column
                    colToPlaceEdge = (node0 % cols) * 2; //node1 would work fine too
                    rowToPlaceEdge = ((2 * (Math.floor(node0 / cols))) + (2 * (Math.floor(node1 / cols)))) / 2;

                    let spot = '  |  \n  ' + nodeType + '  \n  |  ';

                    //node0 is positive terminal 
                    if(nodeType == 'P'){
                        if (node0 > node1){
                            spot = '  | -\n  ' + nodeType + '  \n  | +';
                        }
                        else{
                            spot = '  | +\n  ' + nodeType + '  \n  | -';
                        }
                    }
                    
                    let spotValue = '';
                    if (value){
                        if(nodeType == 'R'){
                            spotValue = value + 'Ω';
                        }
                        else if(nodeType == 'P'){
                            spotValue = value + 'V';
                        }
                    }
                    //check for current in simresults
                    let nodes = node0.toString() + 'and' + node1.toString();
                    if (simResults.hasOwnProperty(nodes)){
                        spotValue += '\n' + parseFloat(simResults[nodes], 10).toPrecision(4).toString() + 'A'
                        hadSim = true;
                    }
                    
                    circuit[rowToPlaceEdge][colToPlaceEdge] = [spot, spotValue, hadSim];
                }
                
            }
        }

        return(
            <div>
                {nodes &&
                    <table id="Circuit" cellPadding="5">
                        <tbody>
                            {circuit && circuit.map((row, index) => 
                                <tr key={index}>
                                    {row && row.map((data, index) => 
                                        <td title={data[1]} key={index}><pre className={"addHoverCursor"} style={data[2] && {color: 'red'} || {color: 'black'}}>{data[0]}</pre></td> //).length != 0 && "addHoverCursor" || "noEdgeExistsHere"
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export {Circuit}
