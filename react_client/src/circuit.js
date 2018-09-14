import React, { Component } from 'react';

class Circuit extends Component{
    constructor(props){
        super(props)
    }

    render() {
        //rows and columns
        //total trs (rows) = rows + (rows - 1) and same for td and columns

        //make data structure before hand and iterate over it creating rows/columns

        //values will be \t\t\t\n\t *DOT OR EDGE TYPE* \t\n\t\t\t

        //algo for making shit

        //1. place nodes
        //  a. gonna create an array of arrays
        //  b. outside loop is rows + rows - 1
        //  c. if i % 2 == 1, make row blank
        //  d. otherwise inside loops is col + col - 1 and place nodes every other spot using %2


        //2. place edges
        //  a. node 1 and node2
        //  b. if node1 and node2 are in the same row (node1 / col == node2 / col)
        //      -place at [ col, row (node/col)] find col by (node1%col + node2%col)
        //  c. ok so were in the same column them (placement is not legal otherwise)
        //      -find column by %col
        //      -find both rows and place in [col, row in between (add up and div by 2)] node/col * 2 to find row
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
        //create blank circuit and place nodes
        for(let i = 0; i < 2 * rows - 1; i++){
            let newRow = []
            if (i % 2 == 0){
                for(let j = 0; j < 2 * cols - 1; j++){
                    if (j % 2 == 0){
                        newRow.push([nodeSpot, '']);
                    }
                    else{
                        newRow.push([blankSpot, '']);
                    }
                }
            }
            else{
                for(let j = 0; j < 2 * cols - 1; j++){
                    newRow.push([blankSpot, '']);
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

                let rowToPlaceEdge = 0;
                let colToPlaceEdge = 0;

                //find if nodes are in same row or same column (this condition is enforced in app.js)
                if (Math.floor(node0 / cols) == Math.floor(node1 / cols)){
                    //same row
                    rowToPlaceEdge = Math.floor(node0 / cols); //node1 would work find too
                    colToPlaceEdge = (node0 % cols) + (node1 % cols);

                    let spot = '\t\n----' + nodeType + '----\n\t';
                    let spotValue = '';
                    if (value){
                        if(nodeType == 'R'){
                            spotValue = value + 'Ω';
                        }
                        else if(nodeType == 'P'){
                            spotValue = value + 'V';
                        }
                    }
                    
                    circuit[rowToPlaceEdge][colToPlaceEdge] = [spot, spotValue];
                    
                }
                else{
                    //same column
                    colToPlaceEdge = (node0 % cols) * 2; //node1 would work fine too
                    rowToPlaceEdge = ((2 * (Math.floor(node0 / cols))) + (2 * (Math.floor(node1 / cols)))) / 2;

                    let spot = '  |  \n  ' + nodeType + '  \n  |  ';
                    let spotValue = '';
                    if (value){
                        if(nodeType == 'R'){
                            spotValue = value + 'Ω';
                        }
                        else if(nodeType == 'P'){
                            spotValue = value + 'V';
                        }
                    }
                    console.log(rowToPlaceEdge, colToPlaceEdge);
                    console.log([spot, spotValue]);
                    circuit[rowToPlaceEdge][colToPlaceEdge] = [spot, spotValue];
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
                                        <td title={data[1]} key={index}><pre>{data[0]}</pre></td>
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
